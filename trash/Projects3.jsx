import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";

import projectImg1 from "../assets/smartfinance.png";
import projectImg2 from "../assets/profilkotabogor.png";
import projectImg3 from "../assets/fathomxdistro.png";
import projectImg4 from "../assets/portofolio1.png";
import projectImg5 from "../assets/portofolio2.png";
import projectImg6 from "../assets/kalkulatorsederhana.png";

const PROJECTS = [
  {
    title: "Smart Finance",
    description:
      "A responsive developer portfolio built to showcase my projects, skills, and journey as a Software Engineering student.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    image: projectImg1,
    link: "https://github.com/muhammadfathan",
  },
  {
    title: "Profil Kota Bogor",
    description:
      "A clean task tracker with create, update, and delete functionality, built to practice component state and UI structure.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    image: projectImg2,
    link: "#",
  },
  {
    title: "FathomXDistro",
    description:
      "A modern redesign of a product landing page focused on clear hierarchy, responsive layout, and smooth interactions.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg3,
    link: "#",
  },
  {
    title: "Portofolio 1",
    description:
      "A modern redesign of a product landing page focused on clear hierarchy, responsive layout, and smooth interactions.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg4,
    link: "#",
  },
  {
    title: "Portofolio 2",
    description:
      "A modern redesign of a product landing page focused on clear hierarchy, responsive layout, and smooth interactions.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg5,
    link: "#",
  },
  {
    title: "Kalkulator Sederhana",
    description:
      "A modern redesign of a product landing page focused on clear hierarchy, responsive layout, and smooth interactions.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg6,
    link: "#",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Projects() {
  return (
    <section id="projects" className="bg-neutral-950 py-24 px-6 relative overflow-hidden">
      {/* Background ambient light untuk menghilangkan kesan polos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
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

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PROJECTS.map((project, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group flex flex-col bg-neutral-900/60 backdrop-blur-sm border border-neutral-800/80 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300"
            >
              {/* Container Foto + Overlay Animasi */}
              <div className="relative w-full aspect-video bg-neutral-950 overflow-hidden border-b border-neutral-800/80">
                <img
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Overlay Gelap Halus yang memudar saat hover */}
                <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              {/* Konten Teks */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading text-white text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                {/* Tags Teknologi */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 group-hover:border-blue-500/40 transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tombol View Project dengan Animasi Panah */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} project`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors duration-300 mt-auto"
                >
                  View Project
                  <HiArrowUpRight className="text-base group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;