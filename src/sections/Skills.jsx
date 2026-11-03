import {
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaReact,
  FaGitAlt,
  FaGithub,
  FaFigma,
  FaNpm,
  FaPython,
  FaNodeJs,
  FaLaravel,
  FaPhp,
} from "react-icons/fa";
import { SiTailwindcss, SiVite, SiMysql, SiSupabase } from "react-icons/si";

// Backend & Database diisi dari teknologi yang sudah kamu pakai di Projects.
// Hapus yang belum nyaman kamu klaim.
const SKILL_CATEGORIES = [
  {
    title: "Frontend",
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
    title: "Backend & Database",
    skills: [
      { name: "Node.js", icon: FaNodeJs },
      { name: "PHP", icon: FaPhp },
      { name: "Laravel", icon: FaLaravel },
      { name: "MySQL", icon: SiMysql },
      { name: "Supabase", icon: SiSupabase },
      { name: "Python", icon: FaPython },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", icon: FaGitAlt },
      { name: "GitHub", icon: FaGithub },
      { name: "Figma", icon: FaFigma },
      { name: "NPM", icon: FaNpm },
    ],
  },
];

function Skills() {
  return (
    <section id="skills" className="border-t border-neutral-900 bg-neutral-950 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-14 font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Skills & technologies
        </h2>

        <div className="border-t border-neutral-800">
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="grid gap-5 border-b border-neutral-800 py-8 lg:grid-cols-12 lg:gap-10"
            >
              <h3 className="font-heading text-lg font-medium text-neutral-400 lg:col-span-3">
                {category.title}
              </h3>

              <ul className="flex flex-wrap gap-x-10 gap-y-5 lg:col-span-9">
                {category.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <li
                      key={skill.name}
                      className="group flex items-center gap-3 text-lg text-neutral-100"
                    >
                      <Icon className="text-2xl text-neutral-500 transition-colors duration-200 group-hover:text-blue-500" />
                      {skill.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;