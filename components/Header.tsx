
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface HeaderProps {
  config: SiteConfig;
}

const Header: React.FC<HeaderProps> = ({ config }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo Section - Circular Instagram Style */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center transition-all group-hover:scale-105 ring-2 ring-emerald-50 shadow-sm">
            {config.logo && !logoError ? (
              <img 
                src={config.logo} 
                alt={config.name} 
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xl">
                {config.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg text-slate-800 tracking-tight">{config.name}</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{config.tagline}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {config.navigation.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="text-slate-600 hover:text-emerald-600 font-medium transition-colors text-sm uppercase tracking-wide"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/admin"
            className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-emerald-600 transition-all shadow-md active:scale-95"
          >
            <i className="fa-solid fa-user-gear mr-2"></i>
            Control Panel
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-600 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-slate-100 shadow-lg animate-fade-in-down">
          <div className="flex flex-col p-4 space-y-4">
            {config.navigation.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="text-slate-600 font-medium px-4 py-2 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/admin"
              className="bg-emerald-600 text-white font-bold py-4 rounded-xl text-center shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Control Panel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
