import { motion } from "framer-motion";
import { HiArrowRight, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import heroImg from "../assets/Hero.png";

// Container mengatur urutan stagger untuk semua elemen teks di kolom kiri.
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Setiap elemen teks (badge, nama, subtitle, deskripsi, tombol) memakai
// variant yang sama agar animasinya konsisten satu sama lain.
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-neutral-950 pt-24 pb-16 px-6"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left: Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left"
        >
          {/* Badge status dengan dot berkedip */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-gray-300 text-xs font-medium">
              Available for work
            </span>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-blue-500 font-medium text-sm uppercase tracking-widest mb-4"
          >
            Hello, I'm
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent"
          >
            Muhammad Fathan Ali Khalifah
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="font-heading text-blue-500 text-xl sm:text-2xl font-semibold mb-6"
          >
            Software Engineering Student & Frontend Developer
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mb-10"
          >
            I build clean, responsive, and user-focused web interfaces.
            Currently sharpening my skills in modern frontend development while
            exploring software engineering fundamentals through real-world
            projects.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <motion.a
              href="#projects"
              aria-label="View my projects"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 ease-out shadow-lg shadow-blue-500/20"
            >
              View Projects
              <HiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="#contact"
              aria-label="Contact me"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm border border-neutral-700 text-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 ease-out"
            >
              Contact Me
              <HiOutlineChatBubbleLeftRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center md:justify-end order-first md:order-last"
        >
          {/* Wrapper terpisah untuk hover scale, agar tidak bentrok
              dengan animasi floating di lapisan dalam */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96"
          >
            {/* Glow biru yang "bernapas" (pulse opacity) */}
            <motion.div
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl"
            />

            {/* Lapisan floating: foto naik-turun perlahan secara berulang */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <img
                src={heroImg}
                alt="Portrait of Muhammad Fathan Ali Khalifah"
                className="relative w-full h-full object-cover rounded-full border border-neutral-800"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;