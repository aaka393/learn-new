import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { fetchHeaderData } from '../../services/apiService';
import { HeaderData } from '../../types/Header';
import { useUIStore } from '../../store/useUIStore';
import AnimatedLink from '../ui/AnimatedLink';

const Header: React.FC = () => {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { isMenuOpen, toggleMenu } = useUIStore();

  useEffect(() => {
    const loadHeaderData = async () => {
      const data = await fetchHeaderData();
      setHeaderData(
        data || {
          title: 'Yensi',
          menu_items: [
            { label: 'Home', slug: '/' },
            { label: 'Articles', slug: '/articles' },
            { label: 'About', slug: '/about' },
            { label: 'Gallery', slug: '/gallery' },
            { label: 'Albums', slug: '/album' },
          ],
        }
      );
    };

    loadHeaderData();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed w-full z-50 transition-all duration-700 ${
          scrolled
            ? 'glass-header shadow-2xl border-b border-white/20'
            : 'bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <AnimatedLink
                to="/"
                className="flex items-center space-x-3 text-2xl font-bold text-white"
                variant="glow"
              >
                <motion.div
                  className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 flex items-center justify-center"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles size={20} className="text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 blur-lg opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
                <span className="gradient-text font-black tracking-tight">
                  {headerData?.title || 'Yensi'}
                </span>
              </AnimatedLink>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {headerData?.menu_items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <AnimatedLink
                    to={item.slug}
                    className="relative text-sm font-medium text-slate-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl group"
                    variant="underline"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <motion.div className="absolute inset-0 glass rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
                  </AnimatedLink>
                </motion.div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-3 rounded-2xl glass text-white relative overflow-hidden group"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden glass-dark border-t border-white/10"
            >
              <div className="px-4 py-8 space-y-6">
                {headerData?.menu_items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div onClick={() => toggleMenu()}>
                      <AnimatedLink
                        to={item.slug}
                        className="block py-4 px-6 text-lg font-medium text-slate-300 hover:text-white rounded-2xl glass hover:glass-card transition-all duration-300"
                        variant="scale"
                      >
                        {item.label}
                      </AnimatedLink>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Enhanced floating particles background */}
      <div className="particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Header;
