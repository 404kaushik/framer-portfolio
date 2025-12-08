import React, { useState } from 'react';
import { Menu, X, Home, User, Briefcase, Mail, FileText, Award } from 'lucide-react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: User, label: 'About', href: '#about' },
    { icon: Briefcase, label: 'Experience', href: '#experience' },
    { icon: Award, label: 'Skills', href: '#skills' },
    { icon: FileText, label: 'Projects', href: '#projects' },
    { icon: Mail, label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#141417]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo/Title */}
          <h1 className="text-xs sm:text-sm md:text-base font-light text-[#919191] hover:text-white transition-colors duration-300">
            Riya's Resume
          </h1>
          
          {/* Menu Button */}
          <button 
            onClick={toggleMenu}
            className="flex items-center gap-2 text-foreground hover:scale-110 transition-all duration-300 group"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={20} className="text-[#919191] group-hover:text-white transition-colors" />
            ) : (
              <Menu size={20} className="text-[#919191] group-hover:text-white transition-colors" />
            )}
            <span className="text-xs sm:text-sm font-light text-[#919191] group-hover:text-white transition-colors hidden sm:inline">
              {isMenuOpen ? 'Close' : 'Menu'}
            </span>
          </button>
        </div>

        {/* Dropdown Menu */}
        <div 
          className={`absolute top-full left-0 right-0 bg-[#141417]/98 backdrop-blur-md border-b border-white/10 transition-all duration-500 ease-out overflow-hidden ${
            isMenuOpen 
              ? 'max-h-screen opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 -translate-y-4'
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li
                  key={item.label}
                  className={`transform transition-all duration-500 ease-out ${
                    isMenuOpen 
                      ? 'translate-x-0 opacity-100' 
                      : '-translate-x-8 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms' 
                  }}
                >
                  <a
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg text-[#919191] hover:text-white hover:bg-white/5 transition-all duration-300 group"
                  >
                    <item.icon 
                      size={20} 
                      className="text-[#919191] group-hover:text-white group-hover:scale-110 transition-all duration-300" 
                    />
                    <span className="text-sm sm:text-base font-light group-hover:translate-x-1 transition-transform duration-300">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Additional Info or CTA */}
            <div className={`mt-6 pt-6 border-t border-white/10 transform transition-all duration-700 ${
              isMenuOpen 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
            }`}>
              <div className="flex flex-col sm:flex-row gap-3 px-4">
                <button className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#919191] hover:text-white rounded-lg text-sm font-light transition-all duration-300 border border-white/10 hover:border-white/20">
                  Download Resume
                </button>
                <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105">
                  Get In Touch
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}      
    </>
  );
}