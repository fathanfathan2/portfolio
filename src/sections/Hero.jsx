import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

/* -------------------------------------------------------------------------- */
/*  Konfigurasi aset 3D (file ada di folder /public/assets)                    */
/* -------------------------------------------------------------------------- */
const GLTF_PATH = "/assets/kartu.glb";
const BAND_TEXTURE_PATH = "/assets/bandd.png";
const PHOTO_PATH = "/assets/foto-profil.png";

useGLTF.preload(GLTF_PATH);
useTexture.preload(BAND_TEXTURE_PATH);
useTexture.preload(PHOTO_PATH);

/* -------------------------------------------------------------------------- */
/*  Pengaturan texture kartu                                                   */
/*                                                                            */
/*  Texture bawaan kartu.glb adalah "atlas" 1024x1024:                         */
/*    - sisi DEPAN  -> setengah kiri  (x 0-511,  y 4-772)                      */
/*    - sisi BELAKANG -> setengah kanan (x 512-1023)                           */
/*  Jadi foto tidak bisa langsung ditempel utuh ke `map` (hasilnya terpotong   */
/*  dan melar). Foto digambar dulu ke area depan atlas lewat canvas.           */
/* -------------------------------------------------------------------------- */
const ATLAS_SIZE = 1024;
const FRONT = { x: 0, y: 4, w: 511, h: 769 };
const BACK = { x: 512, y: 2, w: 512, h: 773 };
const CARD_ASPECT = 0.7164; // lebar / tinggi mesh kartu
const FACE_FOCUS_Y = 0.15; // 0 = crop dari atas, 0.5 = tengah, 1 = bawah

function drawBack(ctx) {
  const { x, y, w, h } = BACK;

  const bg = ctx.createLinearGradient(x, y, x + w, y + h);
  bg.addColorStop(0, "#171717");
  bg.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = "rgba(96, 165, 250, 0.7)";
  ctx.lineWidth = 6;
  ctx.strokeRect(x + 28, y + 28, w - 56, h - 56);

  ctx.textAlign = "center";
  ctx.fillStyle = "#60a5fa";
  ctx.font = "700 150px Inter, system-ui, sans-serif";
  ctx.fillText("MF", x + w / 2, y + h / 2 + 30);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 30px Inter, system-ui, sans-serif";
  ctx.fillText("FRONTEND DEVELOPER", x + w / 2, y + h / 2 + 100);
}

function buildCardTexture(photo, maxAnisotropy) {
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_SIZE;
  canvas.height = ATLAS_SIZE;
  const ctx = canvas.getContext("2d");

  // dasar atlas
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);

  // sisi belakang
  drawBack(ctx);

  // sisi depan: foto dengan crop "cover" sesuai rasio kartu
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, 512, 777);

  const iw = photo.naturalWidth || photo.width;
  const ih = photo.naturalHeight || photo.height;
  let sw = iw;
  let sh = ih;
  if (iw / ih > CARD_ASPECT) {
    sw = ih * CARD_ASPECT;
  } else {
    sh = iw / CARD_ASPECT;
  }
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) * FACE_FOCUS_Y;
  ctx.drawImage(photo, sx, sy, sw, sh, FRONT.x, FRONT.y, FRONT.w, FRONT.h);

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false; // wajib false: UV GLB memakai origin kiri-atas
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/* -------------------------------------------------------------------------- */
/*  Kartu + tali (fisika)                                                      */
/* -------------------------------------------------------------------------- */
function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(GLTF_PATH);
  const bandTexture = useTexture(BAND_TEXTURE_PATH);
  const photoTexture = useTexture(PHOTO_PATH); // foto profil
  const gl = useThree((state) => state.gl);
  const { width, height } = useThree((state) => state.size);

  // Pengganti `materials.base.map`: atlas kartu yang depannya berisi foto Anda
  const cardMap = useMemo(
    () => buildCardTexture(photoTexture.image, gl.capabilities.getMaxAnisotropy()),
    [photoTexture, gl]
  );
  useEffect(() => () => cardMap.dispose(), [cardMap]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              e.target.releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              )
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.35}
                metalness={0.1}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 3D (Canvas) yang menggantikan foto statis                            */
/* -------------------------------------------------------------------------- */
function Card3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
      </Suspense>
      {/* tanpa prop `background` agar latar Hero tetap terlihat */}
      <Environment blur={0.75}>
        <color attach="background" args={["black"]} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */
const wordsToType = [
  "Software Engineering Student",
  "Frontend Developer",
  "React & Web Enthusiast",
];

function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const updateSpotlight = (clientX, clientY, currentTarget) => {
    const rect = currentTarget.getBoundingClientRect();
    setMousePosition({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    updateSpotlight(e.clientX, e.clientY, e.currentTarget);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    updateSpotlight(touch.clientX, touch.clientY, e.currentTarget);
  };

  useEffect(() => {
    const currentWord = wordsToType[textIndex];
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % wordsToType.length);
      typingSpeed = 500;
    }

    const timer = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentWord.substring(0, charIndex - 1)
          : currentWord.substring(0, charIndex + 1)
      );
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));

      if (!isDeleting && charIndex === currentWord.length) {
        setIsDeleting(true);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex]);

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative min-h-screen flex items-center bg-neutral-950 pt-24 pb-16 px-6 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.12), transparent 80%)`,
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start text-left"
        >
          <p className="text-gray-400 font-medium text-sm uppercase tracking-widest mb-2">
            Hello, I'm
          </p>

          <h1 className="font-heading text-white text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Muhammad Fathan{" "}
            <span className="text-blue-400">Ali Khalifah</span>
          </h1>

          <h2 className="font-heading text-blue-400 text-xl sm:text-2xl font-semibold mb-6 min-h-[36px] flex items-center">
            <span>{displayText}</span>
            <span className="w-0.5 h-6 bg-blue-400 ml-1 animate-pulse" />
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mb-10">
            I build clean, responsive, and user focused web interfaces.
            Currently sharpening my skills in modern frontend development while
            exploring software engineering fundamentals through real world
            projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#projects"
              aria-label="View my projects"
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 font-medium text-sm text-white bg-neutral-900 border border-blue-500/50 hover:border-blue-400 active:border-blue-400 transition-colors duration-300 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.45)] overflow-hidden"
            >
              <span className="absolute top-0 left-3 w-2 h-px bg-blue-400" />
              <span className="absolute bottom-0 right-3 w-2 h-px bg-blue-400" />

              <motion.span
                aria-hidden="true"
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/25 to-transparent skew-x-12"
              />

              <span className="relative">View Projects</span>
              <svg
                className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              aria-label="Contact me"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full font-medium text-sm border border-neutral-800 bg-neutral-900/50 text-gray-300 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 backdrop-blur-sm"
            >
              Contact Me
            </motion.a>
          </div>
        </motion.div>

        {/* Kolom kanan: Canvas 3D Card (menggantikan foto statis).
            Catatan: JANGAN beri `scale` pada ancestor Canvas, karena ukuran
            Canvas diukur dari getBoundingClientRect dan bisa jadi terlalu kecil. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-first md:order-last relative w-full flex justify-center md:justify-end"
        >
          <div className="relative w-full max-w-md lg:max-w-lg h-[380px] sm:h-[440px] md:h-[500px] lg:h-[580px] overflow-hidden touch-pan-y">
            <div className="pointer-events-none absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 opacity-20 blur-3xl animate-pulse" />
            <Card3D />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;