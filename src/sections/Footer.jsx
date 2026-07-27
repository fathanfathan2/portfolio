import { HiArrowUp } from "react-icons/hi2";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-6 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Sisi Kiri: Copyright */}
        <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="text-gray-300 font-medium">
            Muhammad Fathan Ali Khalifah
          </span>
          . All rights reserved.
        </p>

        {/* Sisi Kanan: Info Tech & Tombol Scroll to Top */}
        <div className="flex items-center gap-6">
          <p className="text-gray-500 text-xs hidden sm:block">
            Built with <span className="text-blue-400 font-medium">React</span> &{" "}
            <span className="text-blue-400 font-medium">Tailwind CSS</span>
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:border-blue-500/50 transition-all duration-300"
          >
            <HiArrowUp className="text-sm" />
          </button>
        </div>

      </div>    
    </footer>
  );
}

export default Footer;