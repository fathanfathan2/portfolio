import { useState } from "react";
import { HiArrowUpRight, HiClipboardDocument, HiCheck } from "react-icons/hi2";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import emailjs from "@emailjs/browser";

// Kunci diisi lewat file .env (lihat panduan). Kalau belum diisi, form otomatis
// memakai aplikasi email sebagai cadangan.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_READY = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

const EMAIL = "fathanali1809@gmail.com";

const SOCIAL_LINKS = [
  { name: "GitHub", icon: FaGithub, url: "https://github.com/fathanfathan2" },
  { name: "LinkedIn", icon: FaLinkedin, url: "https://www.linkedin.com/in/fathan-ali-780b69384/" },
  { name: "Instagram", icon: FaInstagram, url: "https://instagram.com/h0nestlyftshann_" },
];

const fieldClass =
  "w-full border-b border-neutral-700 bg-transparent py-3 text-base text-white placeholder-neutral-600 transition-colors focus:border-blue-500 focus:outline-none";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === "sent" || status === "error") setStatus("idle");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia: link email di sebelahnya tetap bisa dipakai
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    // Cadangan: kunci EmailJS belum diisi, buka aplikasi email dengan isi terisi
    if (!EMAILJS_READY) {
      const subject = encodeURIComponent(`Portfolio message from ${formData.name}`);
      const body = encodeURIComponent(
        `${formData.message}\n\n${formData.name} (${formData.email})`
      );
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        { publicKey: PUBLIC_KEY }
      );
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="border-t border-neutral-900 bg-neutral-950 px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12">
        {/* Kiri: ajakan + kontak langsung */}
        <div className="lg:col-span-6">
          <h2 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Let's work together
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-400">
            Have a project in mind, or just want to say hi? Send me an email and
            I'll get back to you.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="break-all text-xl text-white underline decoration-neutral-700 underline-offset-8 transition-colors hover:decoration-blue-500 sm:text-2xl"
            >
              {EMAIL}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy email address"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition-colors hover:border-blue-500 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              {copied ? <HiCheck className="text-blue-500" /> : <HiClipboardDocument />}
            </button>
            <span className="text-sm text-neutral-500" aria-live="polite">
              {copied ? "Copied" : ""}
            </span>
          </div>

          <p className="mt-4 text-sm text-neutral-500">Based in Bogor, Indonesia</p>

          <ul className="mt-14 border-t border-neutral-800">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <li key={social.name} className="border-b border-neutral-800">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4 text-neutral-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="text-lg text-neutral-500 transition-colors group-hover:text-blue-500" />
                      {social.name}
                    </span>
                    <HiArrowUpRight className="text-neutral-600 transition-colors group-hover:text-blue-500" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Kanan: form */}
        <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-6 lg:pt-3">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-neutral-400">
              Your name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-neutral-400">
              Your email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm text-neutral-400">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-md bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending"
                ? "Sending…"
                : status === "sent"
                ? "Message sent"
                : EMAILJS_READY
                ? "Send message"
                : "Send via email"}
            </button>
            <p
              role="status"
              className={`mt-3 text-sm ${status === "error" ? "text-red-400" : "text-neutral-500"}`}
            >
              {status === "sent"
                ? "Thanks, your message was sent. I'll reply to the email address you entered."
                : status === "error"
                ? `Your message couldn't be sent. Try again, or email me at ${EMAIL}.`
                : EMAILJS_READY
                ? "I'll reply to the email address you enter above."
                : "This opens your email app with your message already filled in."}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;