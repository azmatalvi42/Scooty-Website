import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { Mail, Send, ArrowRight } from 'lucide-react';

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const contactReasons = [
  { icon: '🏙️', label: 'City Partnership' },
  { icon: '🚌', label: 'Transit Integration' },
  { icon: '🏢', label: 'Real Estate' },
  { icon: '🤝', label: 'General Inquiry' },
];

export const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Partnership inquiry submitted:', formData);
    setFormData({ name: '', email: '', organization: '', role: '', message: '' });
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputClass =
    'w-full px-4 py-3 bg-white dark:bg-black/60 border border-gray-200 dark:border-white/[0.08] rounded-xl focus:ring-2 focus:ring-[#FEC001]/30 focus:border-[#FEC001] outline-none transition-all duration-200 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600';

  return (
    <section id="contact" ref={ref} className="py-16 sm:py-24 ls:py-8 bg-white dark:bg-black relative overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-100 dark:bg-white/[0.04]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: EASING }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs font-bold tracking-[0.2em] text-[#FEC001] uppercase mb-3">
            Let's Connect
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 tracking-tight">
            Partner with <span className="text-[#FEC001]">Us</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Whether you're a city, transit authority, or developer — let's explore how SCOOTY can transform mobility in your community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left — Value props */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: EASING }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white mb-2 tracking-tight">
                Get in touch
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                We work with communities of all sizes across Canada. Fill out the form and our team will get back to you within 1–2 business days.
              </p>
            </div>

            {/* Contact card */}
            <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-[#FEC001]/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#FEC001]" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Email us directly</div>
                  <a
                    href="mailto:partnerships@scooty.ca"
                    className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#FEC001] transition-colors duration-200"
                  >
                    partnerships@scooty.ca
                  </a>
                </div>
              </div>
              <div className="h-px bg-gray-100 dark:bg-white/[0.05] mb-4" />
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                Proudly serving communities across Ontario — Brampton, Barrie, Markham, Burlington and beyond.
              </p>
            </div>

            {/* Partner quote */}
            <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06]">
              <div className="text-2xl text-[#FEC001] leading-none mb-3 font-serif">&ldquo;</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic mb-3">
                SCOOTY helped us close the first-and-last-mile gap we'd been struggling with for years. Our riders now have a seamless connection from transit to their door.
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FEC001]/20 border border-[#FEC001]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FEC001] text-[10px] font-bold">BRM</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">City of Brampton</div>
                  <div className="text-[10px] text-gray-400">Transit Partnership</div>
                </div>
              </div>
            </div>

            {/* I'm reaching out about */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Common inquiries
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {contactReasons.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/[0.06] rounded-xl"
                  >
                    <span className="text-base">{r.icon}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.18, ease: EASING }}
            className="lg:col-span-3"
          >
            <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white mb-6 tracking-tight">
                Send a message
              </h3>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 px-4 py-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-2.5"
                >
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                    ✓ Message sent — we'll be in touch soon!
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Jane Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="jane@city.ca"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="City of Brampton"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Director of Transportation"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your community's mobility needs..."
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-6 bg-[#FEC001] text-black rounded-xl font-bold text-sm hover:bg-[#FFD00F] transition-all duration-200 flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02, boxShadow: isSubmitting ? undefined : '0 0 32px rgba(254,192,1,0.4)' }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/25 border-t-black rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-gray-400 dark:text-gray-600">
                  We typically respond within 1–2 business days.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
