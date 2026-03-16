import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Phone, MapPin, ArrowUp, Zap } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white relative">
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 right-8 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-black hover:bg-primary-400 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 ls:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                Scooty
              </h3>
            </div>
            <p className="text-gray-500 leading-relaxed">
              AI-powered micro-mobility platform transforming urban transportation in 50+ cities worldwide.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Linkedin, href: 'https://linkedin.com/company/scooty' },
                { icon: Twitter, href: 'https://twitter.com/scootyai' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary-400 transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-display">Solutions</h4>
            <div className="space-y-2">
              {[
                'Fleet Intelligence',
                'Route Optimization',
                'Smart Operations',
                'Rider Experience',
                'City Dashboard',
                'Safety & Compliance',
              ].map((item) => (
                <div key={item} className="text-gray-500 hover:text-primary-400 transition-colors duration-300 cursor-pointer">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-display">Company</h4>
            <div className="space-y-2">
              {[
                { name: 'About', href: '#about' },
                { name: 'Technology', href: '#technology' },
                { name: 'Impact', href: '#impact' },
                { name: 'Careers', href: '#careers' },
                { name: 'Contact', href: '#contact' },
              ].map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-gray-500 hover:text-primary-400 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-display">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-500" />
                <span className="text-gray-500">partnerships@scooty.ai</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <span className="text-gray-500">+1 (415) 555-0199</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span className="text-gray-500">548 Market St, San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-secondary-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              &copy; 2024 Scooty. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
