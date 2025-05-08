import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { fetchSiteInfo } from '../../services/api';
import { WordPressSiteInfo } from '../../types/wordpress';

const Footer: React.FC = () => {
  const [siteInfo, setSiteInfo] = useState<WordPressSiteInfo | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadSiteInfo = async () => {
      try {
        const info = await fetchSiteInfo();
        setSiteInfo(info);
      } catch (error) {
        console.error('Error loading site info:', error);
        // Set fallback data
        setSiteInfo({
          name: 'WP React',
          description: 'WordPress + React Integration',
          url: '/',
          home: '/',
          social: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            linkedin: '#'
          }
        });
      }
    };
    
    loadSiteInfo();
  }, []);

  if (!siteInfo) {
    return null; // Or a minimal footer if needed
  }

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{siteInfo.name}</h3>
            <p className="text-gray-300 mb-4">{siteInfo.description}</p>
            <div className="flex space-x-4">
              {siteInfo.social?.facebook && (
                <a href={siteInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {siteInfo.social?.twitter && (
                <a href={siteInfo.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {siteInfo.social?.instagram && (
                <a href={siteInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {siteInfo.social?.linkedin && (
                <a href={siteInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/posts" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-white transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Stay updated with our latest news and events.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} {siteInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;