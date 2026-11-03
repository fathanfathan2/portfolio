import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";

import projectImg1 from "../assets/smartfinance.png";
import projectImg2 from "../assets/profilkotabogor.png";
import projectImg3 from "../assets/fathomxdistro.png";
import projectImg6 from "../assets/kalkulatorsederhana.png";
import projectImg7 from "../assets/gopiket.png";
import projectImg8 from "../assets/tasktrack.png";
import projectImg9 from "../assets/cvmonkey.png";
import projectImg10 from "../assets/jadwalpiket.png";
import projectImg11 from "../assets/ruangamansiswa.png";
import projectImg12 from "../assets/herbalnusantara.png";
import projectImg13 from "../assets/fanfinance.png";

const PROJECTS = [
  {
    title: "Smart Finance",
    description:
      "Sebuah aplikasi finansial keuangan berbasis web untuk memudahkan anak muda seperti gen z, untuk mengatur dan mencatat keuangan serta menghitung pengeluaran.",
    tags: ["React", "Tailwind CSS", "Node JS"],
    image: projectImg1,
    link: "https://github.com/fathanfathan2/smart-finance-app",
    linkText: "View Repository",
  },
  {
    title: "GoPiket",
    description: "Aplikasi berbasis web untuk memudahkan guru dalam mengatur jadwal piket kelas.",
    tags: ["React", "Supabase", "JavaScript"],
    image: projectImg7,
    link: "https://gopiket.pplgsmkn1ciomas.my.id/",
    linkText: "View Project",
  },
  {
    title: "Ruang Aman Siswa",
    description: "Aplikasi berbasis web untuk memanajemen bk dan konseling siswa di sekolah.",
    tags: ["Laravel", "PHP", "MySQL"],
    image: projectImg11,
    link: "https://github.com/fathanfathan2/ruang-aman-siswa.git",
    linkText: "View Repository",
  },
  {
    title: "Herbal Nusantara",
    description:
      "(FrontEnd) Aplikasi berbasis web untuk memudahkan pengguna dalam mencari informasi tentang herbal nusantara.",
    tags: ["React", "Tailwind", "Vite"],
    image: projectImg12,
    link: "https://herbal-nusantara.vercel.app/",
    linkText: "View Project",
  },
  {
    title: "Fan Finance",
    description:
      "(FrontEnd) Aplikasi berbasis web untuk memudahkan pengguna dalam mengatur dan melacak keuangan mereka.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg13,
    link: "https://fanfinance.vercel.app/",
    linkText: "View Project",
  },
  {
    title: "Computer Vision and Monkey Image",
    description:
      "Aplikasi berbasis web untuk mendeteksi gesture tangan menggunakan OpenCV dan Python dan bisa menggambarkan ilustrasi nya menggunakan images.",
    tags: ["Python", "OpenCV"],
    image: projectImg9,
    link: "https://github.com/fathanfathan2/cv-gesture-recognition.git",
    linkText: "View Repository",
  },
  {
    title: "Kalkulator Sederhana",
    description: "Kalkulator sederhana berbasis web",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg6,
    link: "https://fathanfathan2.github.io/Kalkulator-Sederhana/",
    linkText: "View Project",
  },
  {
    title: "Profil Kota Bogor",
    description: "Web profil kota bogor",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg2,
    link: "https://fathanfathan2.github.io/Profil-Kota-Bogor/",
    linkText: "View Project",
  },
  {
    title: "Task Tracker",
    description:
      "(FrontEnd) Aplikasi berbasis web untuk memudahkan pengguna dalam mengatur dan melacak tugas-tugas mereka.",
    tags: ["React", "Tailwind", "Vite"],
    image: projectImg8,
    link: "https://task-track-pplg1809.vercel.app/",
    linkText: "View Project",
  },
  {
    title: "FathomXDistro",
    description:
      "(FrontEnd) Landing page aplikasi eco-merce distro berbasis web dengan fitur pesanan online.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg3,
    link: "https://fathanfathan2.github.io/FathomXDistro/",
    linkText: "View Project",
  },
  {
    title: "Jadwal Piket",
    description: "Aplikasi berbasis web untuk mengelola jadwal piket.",
    tags: ["Laravel", "Tailwind", "Vite", "MySQL", "PHP"],
    image: projectImg10,
    link: "https://github.com/fathanfathan2/jadwal-piket.git",
    linkText: "View Repository",
  },
];

// "View Project" = ada versi live, "View Repository" = hanya source code
const isLive = (project) => project.linkText === "View Project";

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

function StatusMark({ live }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-neutral-500">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          live ? "bg-blue-500" : "border border-neutral-500"
        }`}
        aria-hidden="true"
      />
      {live ? "Live" : "Source code"}
    </span>
  );
}

function Projects() {
  const [active, setActive] = useState(0);
  const current = PROJECTS[active];

  return (
    <section id="projects" className="border-t border-neutral-900 bg-neutral-950 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Projects
          </h2>
          <p className="pb-1 text-sm tabular-nums text-neutral-500">{PROJECTS.length} projects</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Daftar project */}
          <ul className="border-t border-neutral-800 lg:col-span-7">
            {PROJECTS.map((project, index) => (
              <li key={project.title} className="border-b border-neutral-800">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  aria-label={`${project.linkText} for ${project.title}`}
                  className="group flex gap-5 py-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500"
                >
                  {/* Thumbnail hanya di mobile, di desktop ada preview di kanan */}
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    className="aspect-video w-24 shrink-0 self-start rounded-sm border border-neutral-800 object-cover sm:w-32 lg:hidden"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3
                        className={`font-heading text-2xl font-semibold tracking-tight transition-colors duration-200 sm:text-3xl text-white ${
                          active === index ? "lg:text-white" : "lg:text-neutral-500"
                        }`}
                      >
                        {project.title}
                      </h3>
                      <HiArrowUpRight
                        className={`mt-1.5 shrink-0 text-xl transition-colors duration-200 ${
                          active === index ? "text-blue-500" : "text-neutral-600"
                        }`}
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
                      <StatusMark live={isLive(project)} />
                      <span className="text-xs text-neutral-500">{project.tags.join(", ")}</span>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* Preview sticky (desktop) */}
          <aside className="hidden lg:col-span-5 lg:block" aria-hidden="true">
            <div className="sticky top-28">
              <div className="relative aspect-video overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.image}
                    src={current.image}
                    alt=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="truncate text-sm text-neutral-400">{hostOf(current.link)}</p>
                <StatusMark live={isLive(current)} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Projects;