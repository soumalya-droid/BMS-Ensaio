import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HomepageHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Technology', href: '#technology' },
    { name: 'Partners', href: '#partners' },
    { name: 'Contact Us', href: '#contact' },
  ];

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-md' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-2">
              <Battery className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BMS</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              {/* Added explicit Login link */}
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
            </nav>
            <div className="hidden md:flex items-center">
              <Button asChild className="electric-blue-bg-gradient text-white">
                <Link to="/login">Request Demo</Link>
              </Button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-64 bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="flex items-center space-x-2">
                  <Battery className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">BMS</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-800" />
                </button>
              </div>
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-gray-700 hover:text-blue-600 font-medium text-lg"
                  >
                    {link.name}
                  </a>
                ))}
                {/* Added explicit Login link for mobile */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Button asChild className="electric-blue-bg-gradient text-white mt-4">
                  <Link to="/login">Request Demo</Link>
                </Button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomepageHeader;