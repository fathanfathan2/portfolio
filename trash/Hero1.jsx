import { motion } from "framer-motion";
import heroImg from "../assets/Hero.png";

function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-neutral-950 pt-24 pb-16 px-6"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start text-left"
        >
          <p className="text-blue-500 font-medium text-sm uppercase tracking-widest mb-4">
            Hello, I'm
          </p>

          <h1 className="font-heading text-white text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Muhammad Fathan Ali Khalifah
          </h1>

          <h2 className="font-heading text-blue-500 text-xl sm:text-2xl font-semibold mb-6">
            Software Engineering Student & Frontend Developer
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mb-10">
            I build clean, responsive, and user-focused web interfaces.
            Currently sharpening my skills in modern frontend development while
            exploring software engineering fundamentals through real-world
            projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="#projects"
              aria-label="View my projects"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ease-out shadow-lg shadow-blue-500/20"
            >
              View Projects
            </a>

            <a
              href="#contact"
              aria-label="Contact me"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-sm border border-neutral-700 text-gray-200 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 ease-out"
            >
              Contact Me
            </a>
          </div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex justify-center md:justify-end order-first md:order-last"
        >
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl"></div>

            <img
              src={heroImg}
              alt="Portrait of Muhammad Fathan Ali Khalifah"
              className="relative w-full h-full object-cover rounded-full border border-neutral-800"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;