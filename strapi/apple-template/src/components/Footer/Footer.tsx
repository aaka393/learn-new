import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFooterData } from '../../services/apiService';
import { Mail, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const [footerText, setFooterText] = useState<string>('© 2025 Yensi Solutions. All rights reserved.');

  useEffect(() => {
    const loadFooterData = async () => {
      const data = await fetchFooterData();
      if (data && data.text) {
        setFooterText(data.text);
      }
    };

    loadFooterData();
  }, []);

  const footerLinks = [
    {
      title: 'Products',
      links: [
        { name: 'Web Development', url: '#' },
        { name: 'Robotics', url: '#' },
        { name: 'Consulting', url: '#' },
        { name: 'Training', url: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', url: '/about' },
        { name: 'Blog', url: '/articles' },
        { name: 'Gallery', url: '/gallery' },
        { name: 'Contact', url: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', url: '#' },
        { name: 'Terms', url: '#' },
        { name: 'Cookie Policy', url: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Mail size={20} />, url: 'mailto:info@yensi.com' },
    { icon: <Github size={20} />, url: 'https://github.com' },
    { icon: <Twitter size={20} />, url: 'https://twitter.com' },
    { icon: <Linkedin size={20} />, url: 'https://linkedin.com' },
    { icon: <Instagram size={20} />, url: 'https://instagram.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-bold mb-4 block">Yensi Solutions</Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Bringing your digital vision to life with innovative web development and groundbreaking robotics solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`Social link ${index + 1}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      to={link.url} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{footerText}</p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Designed and built with care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;