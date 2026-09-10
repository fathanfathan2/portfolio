import { motion } from "framer-motion";

const TRAITS = [
  { label: "Education", value: "SMKN 1 Ciomas PPLG (Software Engineering)" },
  { label: "Location", value: "Bogor, Indonesia" },
  { label: "Focus", value: "Frontend & Software Fundamentals" },
  { label: "Interests", value: "Web Development & UI/UX" },
];

function About() {
  return (
    <section id="about" className="bg-neutral-950 py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left: introduction dengan animasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-blue-500 font-medium text-sm uppercase tracking-widest mb-4">
            About Me
          </p>

          <h2 className="font-heading text-white text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            A bit about who I am
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-4">
            I'm{" "}
            <span className="text-blue-400 font-semibold">
              Muhammad Fathan Ali Khalifah
            </span>
            , a Software Engineering (PPLG) student at an SMK, currently building a solid
            foundation in web development and software fundamentals.
          </p>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            I'm passionate about frontend development and UI/UX design, and I
            enjoy turning ideas into clean, modern, and user friendly web
            applications. This portfolio itself is part of that ongoing
            learning process.
          </p>
        </motion.div>

        {/* Right: quick stats / traits dengan animasi (delay sedikit) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {TRAITS.map((trait) => (
            <div
              key={trait.label}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <p className="text-blue-500 text-xs font-medium uppercase tracking-widest mb-2">
                {trait.label}
              </p>
              <p className="text-white text-sm sm:text-base font-medium">
                {trait.value}
              </p>
            </div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}

export default About;