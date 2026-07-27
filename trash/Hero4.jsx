import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/Hero.png";

// List kata untuk efek mengetik (bisa ditambah/diubah)
const wordsToType = [
  "Software Engineering Student",
  "Frontend Developer",
  "React & Web Enthusiast",
];

function Hero() {
  // State untuk Mouse Position (Efek Spotlight Background)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // State untuk Typewriter Effect
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  // Logic Mouse Move
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Logic Typewriter Loop (Infinite)
  useEffect(() => {
    const currentWord = wordsToType[textIndex];
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Tahan sebentar saat kata selesai diketik
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
      className="relative min-h-screen flex items-center bg-neutral-950 pt-24 pb-16 px-6 overflow-hidden"
    >
      {/* 1. HOVER SPOTLIGHT EFFECT (Mengikuti Kursor) */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.12), transparent 80%)`,
        }}
      />

      {/* 2. BACKGROUND GRID PATTERN & FLOATING BLOBS */}
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
        {/* LEFT: TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start text-left"
        >
          {/* Badge Status */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Available for New Projects</span>
          </div>

          <p className="text-gray-400 font-medium text-sm uppercase tracking-widest mb-2">
            Hello, I'm
          </p>

          {/* FIX: nama "Ali Khalifah" sekarang solid blue, bukan gradient
              bg-clip-text — menghindari bug teks tampak hitam/pecah di
              beberapa browser saat background-clip tidak ter-render. */}
          <h1 className="font-heading text-white text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Muhammad Fathan{" "}
            <span className="text-blue-400">Ali Khalifah</span>
          </h1>

          {/* 3. INFINITE TYPEWRITER TEXT */}
          <h2 className="font-heading text-blue-400 text-xl sm:text-2xl font-semibold mb-6 min-h-[36px] flex items-center">
            <span>{displayText}</span>
            <span className="w-0.5 h-6 bg-blue-400 ml-1 animate-pulse" />
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mb-10">
            I build clean, responsive, and user-focused web interfaces.
            Currently sharpening my skills in modern frontend development while
            exploring software engineering fundamentals through real-world
            projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* FUTURISTIC "View Projects" BOX — angled corners, glowing
                border, and a scanning light sweep on hover */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#projects"
              aria-label="View my projects"
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 font-medium text-sm text-white bg-neutral-900 border border-blue-500/50 hover:border-blue-400 transition-colors duration-300 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.45)] overflow-hidden"
            >
              {/* corner accents */}
              <span className="absolute top-0 left-3 w-2 h-px bg-blue-400" />
              <span className="absolute bottom-0 right-3 w-2 h-px bg-blue-400" />

              {/* scanning light sweep */}
              <motion.span
                aria-hidden="true"
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/25 to-transparent skew-x-12"
              />

              <span className="relative">View Projects</span>
              <svg
                className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
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

        {/* RIGHT: IMAGE WITH FLOATING ANIMATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center md:justify-end order-first md:order-last relative"
        >
          {/* Main Floating Animation Container */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
          >
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 opacity-20 blur-3xl animate-pulse" />

            {/* Profile Picture Frame */}
            <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-b from-blue-500/30 to-neutral-800/80 shadow-2xl">
              <img
                src={heroImg}
                alt="Portrait of Muhammad Fathan Ali Khalifah"
                className="w-full h-full object-cover rounded-full bg-neutral-900"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;