import { useState, useEffect, useRef, useMemo, useCallback, memo, Suspense } from "react";
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
/*    - sisi BELAKANG -> setengah kanan (x 512-1023), tidak ter-mirror          */
/*  Jadi foto tidak bisa langsung ditempel utuh ke `map` (hasilnya terpotong   */
/*  dan melar). Foto digambar dulu ke kedua sisi atlas lewat canvas.           */
/* -------------------------------------------------------------------------- */
const ATLAS_SIZE = 1024;
const FRONT = { x: 0, y: 4, w: 511, h: 769 };
const BACK = { x: 512, y: 2, w: 512, h: 773 };
const CARD_ASPECT = 0.7164; // lebar / tinggi mesh kartu
const FACE_FOCUS_Y = 0.15; // 0 = crop dari atas, 0.5 = tengah, 1 = bawah

// Kecerahan foto di kartu: 1 = warna asli, turunkan (mis. 0.85) kalau masih terlalu terang
const PHOTO_BRIGHTNESS = 1;

// Kilau yang "lewat" di permukaan kartu (menggantikan silau permanen)
const SHINE_STRENGTH = 0.4; // 0 = matikan kilau
const SHINE_PERIOD = 5; // detik antar kilau
const SHINE_DURATION = 1.4; // detik lama satu lintasan kilau

// Gambar foto ke satu sisi atlas dengan crop "cover" sesuai rasio kartu
function drawPhotoCover(ctx, photo, rect) {
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
  ctx.drawImage(photo, sx, sy, sw, sh, rect.x, rect.y, rect.w, rect.h);
}

function buildCardTexture(photo, maxAnisotropy) {
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_SIZE;
  canvas.height = ATLAS_SIZE;
  const ctx = canvas.getContext("2d");

  // dasar atlas
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);

  // sisi depan (kiri) dan sisi belakang (kanan): sama-sama foto Anda
  drawPhotoCover(ctx, photo, FRONT);
  drawPhotoCover(ctx, photo, BACK);

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
function Band({ maxSpeed = 50, minSpeed = 10, onReady }) {
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

  // Beri tahu Hero bahwa aset sudah termuat (untuk fade-in kartu)
  useEffect(() => {
    onReady?.();
  }, [onReady]);

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

  // Kilau diagonal yang lewat tiap beberapa detik (dihitung di shader kartu)
  const shine = useMemo(() => ({ value: 2 }), []);
  const onBeforeCompile = useMemo(
    () => (shader) => {
      shader.uniforms.uShine = shine;
      shader.uniforms.uShineStrength = { value: SHINE_STRENGTH };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vShinePos;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvShinePos = position;");
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vShinePos;\nuniform float uShine;\nuniform float uShineStrength;"
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          float shineS = vShinePos.x * 0.7 + (vShinePos.y - 0.5) * 0.7;
          float shineQ = (shineS - mix(-0.9, 0.9, uShine)) / 0.09;
          float shineBand = exp(-shineQ * shineQ) * step(uShine, 1.0);
          totalEmissiveRadiance += vec3(shineBand * uShineStrength);`
        );
    },
    [shine]
  );

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
    shine.value = (state.clock.elapsedTime % SHINE_PERIOD) / SHINE_DURATION;
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
              {/* Foto ditampilkan lewat emissiveMap (tidak terpengaruh lampu),
                  dan toneMapped={false} agar warnanya tidak "terbakar". */}
              <meshPhysicalMaterial
                color="black"
                emissive="white"
                emissiveMap={cardMap}
                emissiveIntensity={PHOTO_BRIGHTNESS}
                toneMapped={false}
                roughness={1}
                metalness={0}
                specularIntensity={0}
                onBeforeCompile={onBeforeCompile}
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
/*  Scene 3D (Canvas)                                                          */
/* -------------------------------------------------------------------------- */

// Desktop: Canvas selebar Hero (di belakang teks), kartu digeser ke kolom kanan.
// Makin KECIL angka Z, makin BESAR kartunya. Jangan lebih dari ~18, kalau tidak
// ujung atas tali akan terlihat menggantung di tengah layar.
const CAMERA_Z_DESKTOP = 12;
const CAMERA_Z_MOBILE = 11.5;
const FOV = 25;

function useIsDesktop(query = "(min-width: 768px)") {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// Menggeser posisi kartu di layar ke tengah kolom kanan (tanpa menggeser kamera,
// jadi logika drag tetap akurat).
function CameraRig({ desktop }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const { width, height } = size;
    if (!desktop) {
      camera.clearViewOffset();
      camera.position.set(0, 0, CAMERA_Z_MOBILE);
      camera.updateProjectionMatrix();
      return;
    }
    // pusat kolom kanan: max-w-6xl (1152px), px-6, gap-12
    const gridW = Math.min(1152, width - 48);
    const gridLeft = (width - gridW) / 2;
    const cardX = gridLeft + gridW - (gridW - 48) / 4;
    const shiftPx = cardX - width / 2;

    camera.position.set(0, 0, CAMERA_Z_DESKTOP);
    camera.setViewOffset(width, height, -shiftPx, 0, width, height);
  }, [camera, size, desktop]);

  return null;
}

// Objek konfigurasi ditaruh di luar komponen supaya tidak dibuat ulang
// (objek baru tiap render membuat R3F meng-konfigurasi ulang Canvas).
const GL_OPTIONS = { antialias: true, alpha: true };
const DPR_RANGE = [1, 1.5];
const CAMERA_DESKTOP = { position: [0, 0, CAMERA_Z_DESKTOP], fov: FOV };
const CAMERA_MOBILE = { position: [0, 0, CAMERA_Z_MOBILE], fov: FOV };

const Card3D = memo(function Card3D({ desktop = false, eventSource, onReady }) {
  return (
    <Canvas
      camera={desktop ? CAMERA_DESKTOP : CAMERA_MOBILE}
      dpr={DPR_RANGE}
      gl={GL_OPTIONS}
      // Desktop: event pointer dibaca dari seluruh section, jadi teks & tombol
      // tetap bisa diklik dan kartu tetap bisa diseret.
      eventSource={desktop ? eventSource : undefined}
      eventPrefix={desktop ? "client" : "offset"}
    >
      <CameraRig desktop={desktop} />
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band onReady={onReady} />
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
});

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */
const wordsToType = [
  "Software Engineering Student",
  "Frontend Developer",
  "React & Web Enthusiast",
];

/* -------------------------------------------------------------------------- */
/*  Teks mengetik: dipisah jadi komponen sendiri supaya setiap huruf yang       */
/*  berubah TIDAK me-render ulang seluruh Hero (termasuk scene 3D).            */
/* -------------------------------------------------------------------------- */
function TypingText({ start }) {
  const [begun, setBegun] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  // Mulai mengetik sedikit setelah sinyal `start`, supaya frame pertama
  // kartu 3D selesai dulu.
  useEffect(() => {
    if (!start) return;
    const id = setTimeout(() => setBegun(true), TYPING_START_DELAY_MS);
    return () => clearTimeout(id);
  }, [start]);

  useEffect(() => {
    if (!begun) return;
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
  }, [begun, charIndex, isDeleting, textIndex]);

  return <span>{displayText}</span>;
}

// Animasi mengetik baru dimulai setelah kartu 3D selesai dimuat (supaya tidak
// berebut dengan proses berat saat load). Kalau 3D gagal/lambat, tetap mulai
// setelah TYPING_FALLBACK_MS.
const TYPING_START_DELAY_MS = 400;
const TYPING_FALLBACK_MS = 4000;

function Hero() {
  const sectionRef = useRef(null);
  const isDesktop = useIsDesktop();
  const [cardLoaded, setCardLoaded] = useState(false);
  const [typingFallback, setTypingFallback] = useState(false);
  const handleCardReady = useCallback(() => setCardLoaded(true), []);

  useEffect(() => {
    const id = setTimeout(() => setTypingFallback(true), TYPING_FALLBACK_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-neutral-950 pt-24 pb-16 px-6 isolate overflow-hidden select-none touch-pan-y"
    >
      {/* Cahaya biru statis di tengah (tidak mengikuti kursor).
          Ubah ukuran di w-[...] / h-[...], ubah terangnya di angka 0.25. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95vw,900px)] h-[min(75vh,620px)] bg-[radial-gradient(closest-side,rgba(59,130,246,0.25),transparent)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none will-change-transform"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none will-change-transform"
      />

      {/* Desktop: Canvas 3D selebar Hero, DI ATAS teks (z-20). pointer-events-none
          membuat teks & tombol di bawahnya tetap bisa diklik. */}
      {isDesktop && (
        <div
          className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ${
            cardLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Card3D desktop eventSource={sectionRef} onReady={handleCardReady} />
        </div>
      )}

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
            <TypingText start={cardLoaded || typingFallback} />
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

        {/* Kolom kanan: di desktop kosong (kartu ada di layer belakang);
            di mobile Canvas ditaruh di sini, di atas teks. */}
        <div
          className={
            isDesktop
              ? ""
              : "order-first relative w-full h-[380px] sm:h-[440px]"
          }
        >
          {!isDesktop && (
            <div
              className={`h-full w-full transition-opacity duration-300 ${
                cardLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <Card3D onReady={handleCardReady} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;