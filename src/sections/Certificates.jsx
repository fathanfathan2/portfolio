import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiXMark,
  HiArrowTopRightOnSquare,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";

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
import sertif15 from "../assets/sertifikat paham AI.png";
import sertif16 from "../assets/piagamoni.png";

const WEB = ["HTML5", "CSS3", "JavaScript"];

const CERTIFICATES = [
  { id: 1, title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software", issuer: "Dicoding", date: "2026", credentialId: "DC-FWD-2025-0142", credentialUrl: "#", category: "Software Engineering", skills: WEB, image: sertif1 },
  { id: 2, title: "Pengenalan ke Logika Pemrograman", issuer: "Dicoding", date: "2026", credentialId: "UC-REACT-2025-3391", credentialUrl: "#", category: "Software Engineering", skills: WEB, image: sertif2 },
  { id: 3, title: "Belajar Dasar Cloud dan Gen AI di AWS", issuer: "Dicoding", date: "2026", credentialId: "CR-SEF-2025-8820", credentialUrl: "#", category: "Software Engineering", skills: WEB, image: sertif3 },
  { id: 4, title: "Belajar Dasar Pemrograman Web", issuer: "Dicoding", date: "2026", credentialId: "GG-RWD-2025-1176", credentialUrl: "#", category: "Software Engineering", skills: WEB, image: sertif4 },
  { id: 5, title: "Belajar Dasar Pemrograman JavaScript", issuer: "Dicoding", date: "2026", credentialId: "DC-JSA-2025-5567", credentialUrl: "#", category: "Software Engineering", skills: ["JavaScript", "Algorithms", "Problem Solving"], image: sertif5 },
  { id: 6, title: "Belajar Membuat Front-End Web untuk Pemula", issuer: "Dicoding", date: "2026", credentialId: "UC-BMWA-2025-9903", credentialUrl: "#", category: "Software Engineering", skills: WEB, image: sertif6 },
  { id: 7, title: "Belajar Back-End Pemula dengan JavaScript", issuer: "Dicoding", date: "2026", credentialId: "CR-UIUX-2026-1044", credentialUrl: "#", category: "Software Engineering", skills: WEB, image: sertif7 },
  { id: 8, title: "Belajar Membuat Aplikasi Web dengan React", issuer: "Dicoding", date: "2026", credentialId: "DC-MFA-2026-8831", credentialUrl: "#", category: "Software Engineering", skills: ["React"], image: sertif8 },
  { id: 9, title: "Belajar Dasar AI", issuer: "Dicoding", date: "2026", credentialId: "GG-GIT-2026-4412", credentialUrl: "#", category: "Software Engineering", skills: ["Reading"], image: sertif9 },
  { id: 10, title: "Students Successfully Completed the Dicoding by DBS Foundation Program", issuer: "Dicoding X DBS FOUNDATION", date: "2026", credentialId: "UC-AIWC-2026-7721", credentialUrl: "#", category: "Others", skills: ["Certificate"], image: sertif10 },
  { id: 11, title: "Edukasi : Literasi Keuangan", issuer: "Menyala", date: "2026", credentialId: "CR-SDLC-2026-3090", credentialUrl: "#", category: "Others", skills: ["Education", "Money"], image: sertif11 },
  { id: 12, title: "Introduction to Financial Literacy", issuer: "Dicoding", date: "2026", credentialId: "CR-CCF-2026-1102", credentialUrl: "#", category: "Software Engineering", skills: ["Education", "Literacy"], image: sertif12 },
  { id: 13, title: "Kompetisi Nasional Indonesia 8.0(online) -English", issuer: "Kompetisi Nasional Indonesia", date: "2026", credentialId: "UC-API-2026-5541", credentialUrl: "#", category: "English", skills: ["English"], image: sertif13 },
  { id: 14, title: "Kompetisi Nasional Indonesia 9.0(online) -English", issuer: "Kompetisi Nasional Indonesia", date: "2026", credentialId: "DC-AJS-2026-9912", credentialUrl: "#", category: "English", skills: ["English"], image: sertif14 },
  { id: 15, title: "Program Paham AI - Literasi kecerdasan Artifisial", issuer: "Senopati Academy x Polri", date: "2026", credentialId: "DC-AJS-2026-9912", credentialUrl: "#", category: "Others", skills: ["Education", "Literacy", "Artificial Intelligence"], image: sertif15 },
  { id: 16, title: "Olimpiade Nasional Indonesia 17(online) -English", issuer: "Olimpiade Nasional Indonesia", date: "2026", credentialId: "DC-AJS-2026-9912", credentialUrl: "#", category: "English", skills: ["English"], image: sertif16 },
];

const CATEGORIES = ["All", "Software Engineering", "English", "Others"];

const countOf = (category) =>
  category === "All"
    ? CERTIFICATES.length
    : CERTIFICATES.filter((c) => c.category === category).length;

function CertificateCard({ cert, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(cert.id)}
      className="group text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
    >
      <div className="aspect-[3/2] overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900 transition-colors duration-200 group-hover:border-neutral-600">
        <img
          src={cert.image}
          alt={`${cert.title} certificate`}
          loading="lazy"
          className="h-full w-full object-cover brightness-90 transition duration-300 group-hover:brightness-100"
        />
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-neutral-100">
        {cert.title}
      </h3>
      <p className="mt-1 text-xs text-neutral-500">{cert.issuer}</p>
    </button>
  );
}

function CertificateModal({ cert, position, total, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);
  const hasLink = cert.credentialUrl && cert.credentialUrl !== "#";

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  // Kunci scroll halaman selama modal terbuka, fokuskan tombol close
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-950/90 p-4 backdrop-blur-sm sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={cert.title}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900 lg:grid-cols-[1.6fr_1fr]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close certificate preview"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          <HiXMark className="text-lg" />
        </button>

        <div className="flex items-center justify-center bg-neutral-950 p-3 sm:p-5">
          <img
            src={cert.image}
            alt={`${cert.title} certificate`}
            className="max-h-[70vh] w-full object-contain"
          />
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <h3 className="pr-8 font-heading text-xl font-semibold leading-snug text-white sm:text-2xl">
            {cert.title}
          </h3>
          <p className="mt-2 text-blue-500">{cert.issuer}</p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-neutral-500">Year</dt>
              <dd className="mt-0.5 text-neutral-100">{cert.date}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Credential ID</dt>
              <dd className="mt-0.5 break-all text-neutral-100">{cert.credentialId}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Skills</dt>
              <dd className="mt-0.5 text-neutral-100">{cert.skills.join(", ")}</dd>
            </div>
          </dl>

          {hasLink && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-white underline decoration-neutral-600 underline-offset-4 transition-colors hover:decoration-blue-500"
            >
              Verify credential
              <HiArrowTopRightOnSquare className="text-base" />
            </a>
          )}

          <div className="min-h-10 flex-1" />

          <div className="flex items-center justify-between border-t border-neutral-800 pt-5">
            <span className="text-sm tabular-nums text-neutral-500">
              {position} of {total}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous certificate"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 transition-colors hover:border-blue-500 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <HiChevronLeft />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next certificate"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 text-neutral-300 transition-colors hover:border-blue-500 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <HiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Certificates() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  const list =
    activeCategory === "All"
      ? CERTIFICATES
      : CERTIFICATES.filter((cert) => cert.category === activeCategory);

  const selectedIndex = list.findIndex((c) => c.id === selectedId);
  const selected = selectedIndex >= 0 ? list[selectedIndex] : null;

  const go = (step) => {
    const next = (selectedIndex + step + list.length) % list.length;
    setSelectedId(list[next].id);
  };

  return (
    <section id="certificates" className="border-t border-neutral-900 bg-neutral-950 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Certificates
          </h2>
          <p className="pb-1 text-sm tabular-nums text-neutral-500">
            {CERTIFICATES.length} earned
          </p>
        </div>

        {/* Filter */}
        <div className="mb-10 flex flex-wrap gap-x-7 gap-y-2 border-b border-neutral-800">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`-mb-px border-b-2 pb-3 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 ${
                  isActive
                    ? "border-blue-500 text-white"
                    : "border-transparent text-neutral-500 hover:text-neutral-200"
                }`}
              >
                {category}
                <span className="ml-2 text-xs tabular-nums text-neutral-600">
                  {countOf(category)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
          {list.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} onOpen={setSelectedId} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <CertificateModal
            key="certificate-modal"
            cert={selected}
            position={selectedIndex + 1}
            total={list.length}
            onClose={() => setSelectedId(null)}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default Certificates;