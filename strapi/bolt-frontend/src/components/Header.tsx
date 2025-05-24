import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchHeaderData } from '../services/service';
import { HeaderData } from '../types/Header';
import { MonitorSmartphone } from 'lucide-react';

const Header: React.FC = () => {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        const data = await fetchHeaderData();
        if (data) {
          setHeaderData(data);
        }
      } catch (error) {
        console.error('Failed to load header data:', error);
      }
    };

    loadHeaderData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!headerData) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-semibold"
          >
            <MonitorSmartphone className={`h-6 w-6 ${isScrolled ? 'text-black' : 'text-black'}`} />
            <span className={`transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-black'}`}>
              {headerData.title}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {headerData.menu_items.map((item) => (
              <Link
                key={item.id}
                to={item.slug.trim()}
                className={`text-sm font-medium transition-colors duration-300 hover:text-gray-900 ${
                  location.pathname === item.slug.trim()
                    ? 'text-black border-b-2 border-black'
                    : isScrolled ? 'text-gray-700' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`space-y-1.5 transition-all duration-300 ${isMobileMenuOpen ? 'transform rotate-90' : ''}`}>
              <span className={`block w-6 h-0.5 ${isScrolled ? 'bg-black' : 'bg-black'}`}></span>
              <span className={`block w-6 h-0.5 ${isScrolled ? 'bg-black' : 'bg-black'}`}></span>
              <span className={`block w-6 h-0.5 ${isScrolled ? 'bg-black' : 'bg-black'}`}></span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[400px] bg-white shadow-lg' : 'max-h-0'
        }`}
      >
        <nav className="px-4 py-2 space-y-1 mb-4">
          {headerData.menu_items.map((item) => (
            <Link
              key={item.id}
              to={item.slug.trim()}
              className={`block py-3 px-4 text-base font-medium rounded-lg transition ${
                location.pathname === item.slug.trim()
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-black'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;