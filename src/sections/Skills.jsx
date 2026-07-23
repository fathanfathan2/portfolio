import { motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaReact,
  FaGitAlt,
  FaGithub,
  FaFigma,
  FaNpm,
} from "react-icons/fa";
import { SiTailwindcss, SiVite } from "react-icons/si";

const SKILL_CATEGORIES = [
  {
    title: "Frontend Development",
    skills: [
      { name: "HTML5", icon: FaHtml5 },
      { name: "CSS3", icon: FaCss3Alt },
      { name: "JavaScript", icon: FaJsSquare },
      { name: "React", icon: FaReact },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Vite", icon: SiVite },
    ],
  },
  {
    title: "Tools & Others",
    skills: [
      { name: "Git", icon: FaGitAlt },
      { name: "GitHub", icon: FaGithub },
      { name: "Figma", icon: FaFigma },
      { name: "NPM", icon: FaNpm },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function Skills() {
  return (
    <section id="skills" className="bg-neutral-950 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-blue-500 font-medium text-sm uppercase tracking-widest mb-2">
            What I Work With
          </p>
          <h2 className="font-heading text-white text-3xl sm:text-4xl font-semibold tracking-tight">
            Skills & Technologies
          </h2>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-col gap-14">
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.title}>
              <h3 className="font-heading text-gray-200 text-lg font-semibold mb-6">
                {category.title}
              </h3>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {category.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      variants={cardVariants}
                      className="flex flex-col items-center justify-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 ease-out"
                    >
                      <Icon className="text-3xl text-blue-500" />
                      <span className="text-gray-300 text-sm font-medium">
                        {skill.name}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;