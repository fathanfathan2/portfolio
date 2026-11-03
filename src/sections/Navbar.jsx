import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

const NAVBAR_HEIGHT = 64; // h-16

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  // Garis tipis di bawah navbar yang menunjukkan progres scroll halaman
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 200) setActiveId(""); // masih di area hero
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tandai section yang sedang dilihat
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(`#${entry.target.id}`);
        });
      },
      { rootMargin: `-${NAVBAR_HEIGHT + 40}px 0px -55% 0px` }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);

    // Jeda kecil agar animasi tutup menu tidak membatalkan scroll
    setTimeout(() => {
      if (href === "#top" || href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-neutral-800 bg-neutral-950/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          <span className="h-2 w-2 bg-blue-500" aria-hidden="true" />
          Portofolio
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-1 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 ${
                  isActive ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-blue-500 transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="text-2xl text-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Progress scroll */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-blue-500"
        aria-hidden="true"
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-full left-0 w-full overflow-hidden border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col px-6 py-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`border-b border-neutral-900 py-4 font-heading text-xl last:border-b-0 ${
                    activeId === link.href ? "text-blue-500" : "text-neutral-200"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;