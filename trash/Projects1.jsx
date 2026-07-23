import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";

const PROJECTS = [
  {
    title: "Personal Portfolio Website",
    description:
      "A responsive developer portfolio built to showcase my projects, skills, and journey as a Software Engineering student.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    link: "#",
  },
  {
    title: "Task Management App",
    description:
      "A clean task tracker with create, update, and delete functionality, built to practice component state and UI structure.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    link: "#",
  },
  {
    title: "Landing Page Redesign",
    description:
      "A modern redesign of a product landing page focused on clear hierarchy, responsive layout, and smooth interactions.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    link: "#",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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

function Projects() {
  return (
    <section id="projects" className="bg-neutral-950 py-24 px-6">
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
            My Work
          </p>
          <h2 className="font-heading text-white text-3xl sm:text-4xl font-semibold tracking-tight">
            Featured Projects
          </h2>
        </motion.div>

        {/* Project grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PROJECTS.map((project) => (
            <motion.div
              key={project.title}
              variants={cardVariants}
              className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <h3 className="font-heading text-white text-xl font-semibold mb-3">
                {project.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-blue-500 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* FIX: Ditambahkan tag pembuka 'a' di bawah ini */}
              <a
                href={project.link}
                aria-label={`View ${project.title} project`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-200 group-hover:text-blue-500 transition-colors duration-300 mt-auto"
              >
                View Project
                <HiArrowUpRight className="text-base" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;