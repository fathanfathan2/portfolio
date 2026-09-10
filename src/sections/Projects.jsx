import { HiArrowUpRight } from "react-icons/hi2";

// 1. IMPORT GAMBAR (Pastikan nama & ekstensi file ini ADA di folder src/assets)
import projectImg1 from "../assets/smartfinance.png";
import projectImg2 from "../assets/profilkotabogor.png";
import projectImg3 from "../assets/fathomxdistro.png";
import projectImg4 from "../assets/portofolio1.png";
import projectImg5 from "../assets/portofolio2.png";
import projectImg6 from "../assets/kalkulatorsederhana.png";
import projectImg7 from "../assets/gopiket.png";
import projectImg8 from "../assets/tasktrack.png";
import projectImg9 from "../assets/cvmonkey.png";

const PROJECTS = [
  {
    title: "Smart Finance",
    description:
      "Sebuah aplikasi finansial keuangan berbasis web untuk memudahkan anak muda seperti gen z, untuk mengatur dan mencatat keuangan serta menghitung pengeluaran.",
    tags: ["React", "Tailwind CSS", "Node JS"],
    image: projectImg1,
    link: "https://github.com/fathanfathan2/smart-finance-app",
    linkText: "View Repository", // Teks khusus untuk GitHub
  },
  {
    title: "GoPiket",
    description:
      "Aplikasi berbasis web untuk memudahkan guru dalam mengatur jadwal piket kelas.",
    tags: ["React", "Supabase", "JavaScript"],
    image: projectImg7,
    link: "https://gopiket.pplgsmkn1ciomas.my.id/",
    linkText: "View Project", // Teks khusus untuk Live Web
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
    title: "Portofolio 1",
    description: "Portofolio website.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg4,
    link: "https://fathanfathan2.github.io/Portofolio-Fathan/",
    linkText: "View Project",
  },
  {
    title: "Portofolio 2",
    description: "Portofolio website.",
    tags: ["React", "Tailwind", "Vite"],
    image: projectImg5,
    link: "https://portfolio-one-alpha-62.vercel.app/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAadF9E17yNCuJc5K_kG2bdoTL1KbgdjPD55DIu3U2f1yMkcHe7efqlJa6VDMDQ_aem_Mcfj7emGueJR6hRAlQ0xzA",
    linkText: "View Project",
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
      "Aplikasi berbasis web untuk memudahkan pengguna dalam mengatur dan melacak tugas-tugas mereka.",
    tags: ["React", "Tailwind", "Vite"],
    image: projectImg8,
    link: "https://task-track-pplg1809.vercel.app/",
    linkText: "View Project",
  },
  {
    title: "FathomXDistro",
    description:
      "Landing page aplikasi eco-merce distro berbasis web dengan fitur pesanan online.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: projectImg3,
    link: "https://fathanfathan2.github.io/FathomXDistro/",
    linkText: "View Project",
  },
];

function Projects() {
  return (
    <section id="projects" className="bg-neutral-950 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="mb-16 max-w-2xl">
          <p className="text-blue-500 font-medium text-sm uppercase tracking-widest mb-2">
            My Work
          </p>
          <h2 className="font-heading text-white text-3xl sm:text-4xl font-semibold tracking-tight">
            Featured Projects
          </h2>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              {/* Wadah FOTO PROJECT */}
              <div className="relative w-full aspect-video bg-neutral-950 overflow-hidden border-b border-neutral-800">
                <img
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Konten Teks */}
              <div className="p-6 flex flex-col flex-1">
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

                {/* Tombol Dinamis */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.linkText} for ${project.title}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-200 group-hover:text-blue-500 transition-colors duration-300 mt-auto"
                >
                  {project.linkText || "View Project"}
                  <HiArrowUpRight className="text-base" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;