import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 relative">
      {/* Apple-style glass footer */}
      <div className="backdrop-blur-2xl bg-white/60 border-t border-white/20 shadow-apple-glass">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-8 h-8 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-xl"></div>
                  <div className="absolute inset-0 bg-white/10"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white/30 rounded backdrop-blur-sm"></div>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">Liquid Blog</span>
              </div>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Exploring the intersection of design and technology through 
                beautiful, thoughtful content and liquid glass aesthetics.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Blog', 'Articles', 'About'].map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <div className="flex space-x-3">
                {[
                  { icon: Github, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' }
                ].map(({ icon: Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    className="group relative p-2 rounded-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-xl shadow-apple-glass group-hover:bg-white/30"></div>
                    <Icon size={18} className="relative z-10 text-gray-600 group-hover:text-gray-900" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <span>© {currentYear} Liquid Blog. Made with</span>
              <Heart size={16} className="text-red-500 fill-current" />
              <span>and glassmorphism</span>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};