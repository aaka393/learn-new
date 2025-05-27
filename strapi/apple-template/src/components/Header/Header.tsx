import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { fetchHeaderData } from '../../services/apiService';
import { HeaderData } from '../../types/Header';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const loadHeaderData = async () => {
      const data = await fetchHeaderData();
      setHeaderData(data || { title: 'Yensi', menu_items: [
        { label: 'Home', slug: '/' },
        { label: 'Articles', slug: '/articles' },
        { label: 'About', slug: '/about' },
        { label: 'Gallery', slug: '/gallery' }
      ] });
    };

    loadHeaderData();

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className={`text-xl font-semibold ${scrolled ? 'text-gray-900' : 'text-gray-500'}`}>
              {headerData?.title || 'Yensi'}
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {headerData?.menu_items.map((item, index) => (
              <Link
                key={index}
                to={item.slug}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-400 hover:text-gray-500'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button aria-label="Search" className={`text-gray-700 hover:text-gray-900 ${scrolled ? 'text-gray-900' : 'text-gray-400'}`}>
              <Search size={20} />
            </button>
            <button aria-label="Shopping Bag" className={`${scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-500 hover:text-gray-300'}`}>
              <ShoppingBag size={20} />
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {headerData?.menu_items.map((item, index) => (
                <Link
                  key={index}
                  to={item.slug}
                  className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex space-x-6 pt-4">
                <button aria-label="Search" className="text-gray-700 hover:text-gray-900">
                  <Search size={20} />
                </button>
                <button aria-label="Shopping Bag" className="text-gray-700 hover:text-gray-900">
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;