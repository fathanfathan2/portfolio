import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiXMark,
  HiArrowTopRightOnSquare,
  HiCalendarDays,
  HiCheckBadge,
} from "react-icons/hi2";

// ---------------------------------------------------------------------------
// IMPORT 14 GAMBAR SERTIFIKAT DARI FOLDER ASSETS
// ---------------------------------------------------------------------------
import sertif1 from "../assets/sertif1.png";
import sertif2 from "../assets/sertif2.png";
import sertif3 from "../assets/sertif3.png";
import sertif4 from "../assets/sertif4.png";
import sertif5 from "../assets/sertif5.png";
import sertif6 from "../assets/sertif6.png";
import sertif7 from "../assets/sertif7.png";
import sertif8 from "../assets/sertif8.png";
import sertif9 from "../assets/sertif9.png";
import sertif10 from "../assets/sertif10.png";
import sertif11 from "../assets/sertif11.png";
import sertif12 from "../assets/sertif12.png";
import sertif13 from "../assets/sertif13.png";
import sertif14 from "../assets/sertif14.png";

// ---------------------------------------------------------------------------
// DAFTAR SERTIFIKAT (14 DATA)
// ---------------------------------------------------------------------------
const CERTIFICATES = [
  {
    id: 1,
    title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "DC-FWD-2025-0142",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["HTML5", "CSS3", "JavaScript"],
    image: sertif1,
  },
  {
    id: 2,
    title: "Pengenalan ke Logika Pemrograman",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "UC-REACT-2025-3391",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["HTML5", "CSS3", "JavaScript"],
    image: sertif2,
  },
  {
    id: 3,
    title: "Belajar Dasar Cloud dan Gen AI di AWS",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "CR-SEF-2025-8820",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["HTML5", "CSS3", "JavaScript"],
    image: sertif3,
  },
  {
    id: 4,
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "GG-RWD-2025-1176",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["HTML5", "CSS3", "JavaScript"],
    image: sertif4,
  },
  {
    id: 5,
    title: "Belajar Dasar Pemrograman JavaScript",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "DC-JSA-2025-5567",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["JavaScript", "Algorithms", "Problem Solving"],
    image: sertif5,
  },
  {
    id: 6,
    title: "Belajar Membuat Front-End Web untuk Pemula",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "UC-BMWA-2025-9903",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["HTML5", "CSS3", "JavaScript"],
    image: sertif6,
  },
  {
    id: 7,
    title: "Belajar Back-End Pemula dengan JavaScript",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "CR-UIUX-2026-1044",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["HTML5", "CSS3", "JavaScript"],
    image: sertif7,
  },
  {
    id: 8,
    title: "Belajar Membuat Aplikasi Web dengan React",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "DC-MFA-2026-8831",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["React"],
    image: sertif8,
  },
  {
    id: 9,
    title: "Belajar Dasar AI",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "GG-GIT-2026-4412",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["Reading"],
    image: sertif9,
  },
  {
    id: 10,
    title: "Students Successfully Completed the Dicoding by DBS Foundation Program",
    issuer: "Dicoding X DBS FOUNDATION",
    date: "2026",
    credentialId: "UC-AIWC-2026-7721",
    credentialUrl: "#",
    category: "Others",
    skills: ["Certificate"],
    image: sertif10,
  },
  {
    id: 11,
    title: "Edukasi : Literasi Keuangan",
    issuer: "Menyala",
    date: "2026",
    credentialId: "CR-SDLC-2026-3090",
    credentialUrl: "#",
    category: "Others",
    skills: ["Education", "Money"],
    image: sertif11,
  },
  {
    id: 12,
    title: "Introduction to Financial Literacy",
    issuer: "Dicoding",
    date: "2026",
    credentialId: "CR-CCF-2026-1102",
    credentialUrl: "#",
    category: "Software Engineering",
    skills: ["Education", "Literacy"],
    image: sertif12,
  },
  {
    id: 13,
    title: "Kompetisi Nasional Indonesia 8.0(online) -English",
    issuer: "Kompetisi Nasional Indonesia",
    date: "2026",
    credentialId: "UC-API-2026-5541",
    credentialUrl: "#",
    category: "English",
    skills: ["English"],
    image: sertif13,
  },
  {
    id: 14,
    title: "Kompetisi Nasional Indonesia 9.0(online) -English",
    issuer: "Kompetisi Nasional Indonesia",
    date: "2026",
    credentialId: "DC-AJS-2026-9912",
    credentialUrl: "#",
    category: "English",
    skills: ["English"],
    image: sertif14,
  },
];

const CATEGORIES = ["All", "Software Engineering", "English", "Others"];

// Variants animasi Framer Motion
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// ---------------------------------------------------------------------------
// Kartu sertifikat tunggal
// ---------------------------------------------------------------------------
function CertificateCard({ cert, onOpen }) {
  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => onOpen(cert)}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900/50 backdrop-blur-md border border-neutral-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-colors duration-300"
    >
      {/* Gambar sertifikat + efek zoom saat hover */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={cert.image}
          alt={`${cert.title} certificate`}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent" />

        {/* Tombol "View Certificate" muncul saat hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/30">
            View Certificate
          </span>
        </div>
      </div>

      {/* Detail singkat */}
      <div className="p-5">
        <h3 className="font-heading text-white text-base font-semibold mb-1 line-clamp-1">
          {cert.title}
        </h3>
        <p className="text-blue-400 text-sm font-medium mb-3">{cert.issuer}</p>

        <div className="flex flex-wrap gap-1.5">
          {cert.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium text-gray-400 bg-neutral-800/80 border border-neutral-700 rounded-full px-2.5 py-1"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Modal / Lightbox preview
// ---------------------------------------------------------------------------
function CertificateModal({ cert, onClose }) {
  // Tutup modal dengan tombol Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl shadow-blue-500/10"
          >
            {/* Tombol close */}
            <button
              onClick={onClose}
              aria-label="Close certificate preview"
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900/80 border border-neutral-700 text-gray-300 hover:text-white hover:border-blue-500/50 transition-colors duration-300"
            >
              <HiXMark className="text-lg" />
            </button>

            {/* Gambar sertifikat */}
            <div className="relative aspect-[3/2] bg-neutral-950">
              <img
                src={cert.image}
                alt={`${cert.title} certificate`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Detail modal */}
            <div className="p-6 sm:p-8">
              <h3 className="font-heading text-white text-xl sm:text-2xl font-semibold mb-2">
                {cert.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-6">
                <span className="text-blue-400 font-medium">{cert.issuer}</span>
                <span className="inline-flex items-center gap-1.5">
                  <HiCalendarDays className="text-base" />
                  {cert.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HiCheckBadge className="text-base" />
                  {cert.credentialId}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ease-out shadow-lg shadow-blue-500/20"
              >
                Verify Credential
                <HiArrowTopRightOnSquare className="text-base" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Komponen utama
// ---------------------------------------------------------------------------
function Certificates() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCert, setSelectedCert] = useState(null);

  const filteredCertificates =
    activeCategory === "All"
      ? CERTIFICATES
      : CERTIFICATES.filter((cert) => cert.category === activeCategory);

  return (
    <section id="certificates" className="relative bg-neutral-950 py-24 px-6 overflow-hidden">
      {/* Glow dekoratif */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 max-w-2xl"
        >
          <p className="text-blue-500 font-medium text-sm uppercase tracking-widest mb-2">
            Achievements
          </p>
          <h2 className="font-heading text-white text-3xl sm:text-4xl font-semibold tracking-tight">
            Certificates
          </h2>
        </motion.div>

        {/* Tab filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeCategory === category
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {activeCategory === category && (
                <motion.span
                  layoutId="activeCategoryPill"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0 bg-blue-500 rounded-full -z-10"
                />
              )}
              <span>{category}</span>
            </button>
          ))}
        </motion.div>

        {/* Grid sertifikat */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCertificates.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} onOpen={setSelectedCert} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal preview */}
      <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
    </section>
  );
}

export default Certificates;