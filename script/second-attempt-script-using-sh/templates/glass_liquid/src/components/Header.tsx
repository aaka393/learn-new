// Header.tsx
import React from 'react';
import { Home, BookOpen, FileText } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export const Header: React.FC = () => {
  const { activeSection, setActiveSection } = useUIStore();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'blog' as const, label: 'Blog', icon: BookOpen },
    { id: 'articles' as const, label: 'Articles', icon: FileText },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Apple-style liquid glass header */}
      <div className=" bg-white/50 border-b border-white/20 shadow-apple-glass transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden">
                {/* Glass effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-xl"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/30 rounded-lg backdrop-blur-sm shadow-glass-inset"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Liquid Blog
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`
                    relative px-5 py-2.5 rounded-2xl font-medium transition-all duration-300
                    flex items-center space-x-2 group overflow-hidden
                    ${activeSection === id
                      ? ' text-gray-900 shadow-apple-glass'
                      : 'text-gray-700 hover:bg-white/25 hover:text-gray-900 shadow border'
                    }
                  `}
                >
                  {/* Glass shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                  
                  {activeSection === id && (
                    <div className="absolute inset-0 rounded-2xl"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden relative p-3 rounded-2xl bg-white/30 backdrop-blur-xl shadow-apple-glass hover:bg-white/40 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0  via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-5 h-4 flex flex-col justify-between">
                <div className="w-full h-0.5 bg-gray-800 rounded-full"></div>
                <div className="w-full h-0.5 bg-gray-800 rounded-full"></div>
                <div className="w-full h-0.5 bg-gray-800 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
