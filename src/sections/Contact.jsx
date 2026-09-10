import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiEnvelope,
  HiMapPin,
  HiPaperAirplane,
  HiCheckCircle,
} from "react-icons/hi2";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    icon: FaGithub,
    url: "https://github.com/fathanfathan2", 
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    url: "https://www.linkedin.com/in/fathan-ali-780b69384/", 
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://instagram.com/h0nestlyftshann_", 
  },
];

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative bg-neutral-950 py-24 px-6 overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-blue-500 font-medium text-sm uppercase tracking-widest mb-2">
            Get In Touch
          </p>
          <h2 className="font-heading text-white text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Let's Work Together
          </h2>
          <p className="text-gray-400 text-base">
            Have a project in mind or want to say hi? Feel free to send me a message!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-white text-lg font-semibold mb-6">Contact Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <HiEnvelope className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <a href="mailto:fathanali1809@gmail.com" className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
                      fathanali1809@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <HiMapPin className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-white text-sm font-medium">Bogor, Indonesia</p>
                  </div>
                </div>
              </div>

              <hr className="border-neutral-800 my-6" />

              <p className="text-xs text-gray-400 mb-4">Connect with me</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-blue-500/50 hover:bg-neutral-800 transition-all duration-300"
                      aria-label={social.name}
                    >
                      <Icon className="text-lg" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-3 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Pesan tidak akan sampai karena fitur pesan sedang dalam proses pengerjaan."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : isSubmitted ? (
                  <>
                    <HiCheckCircle className="text-lg text-emerald-300" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <HiPaperAirplane className="text-sm" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;