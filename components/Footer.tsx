
import React from 'react';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  const socialLinks = Array.isArray(config.social) ? config.social : [];
  const navigationLinks = Array.isArray(config.navigation) ? config.navigation : [];
  const supportLinks = Array.isArray(config.footer?.supportLinks) ? config.footer.supportLinks : [];

  const isInternalLink = (path: string) => {
    if (!path) return false;
    return path.startsWith('#/') || path.startsWith('/') || path.includes(window.location.origin);
  };

  const getCleanPath = (path: string) => {
    if (!path) return '/';
    if (path.startsWith('#/')) return path.substring(1);
    if (path.startsWith('#')) return path.substring(1);
    return path;
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 md:pt-24 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-white text-2xl font-black mb-6 uppercase tracking-tighter">{config.name}</h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-xs">
              {config.footer?.brandDescription || 'Empowering professional education for over a decade.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              {socialLinks.map(social => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500"
                  title={social.platform}
                  aria-label={`Follow us on ${social.platform}`}
                >
                  <i className={`fa-brands ${social.icon} text-lg`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">{config.footer?.quickLinksLabel || 'Navigation'}</h4>
            <ul className="space-y-4 text-sm font-medium">
              {navigationLinks.map(nav => {
                const isInternal = isInternalLink(nav.path);
                return (
                  <li key={nav.label}>
                    {isInternal ? (
                      <Link to={getCleanPath(nav.path)} className="hover:text-emerald-500 transition-colors block py-1">{nav.label}</Link>
                    ) : (
                      <a href={nav.path} className="hover:text-emerald-500 transition-colors block py-1">{nav.label}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">{config.footer?.supportLinksLabel || 'Resources'}</h4>
            <ul className="space-y-4 text-sm font-medium">
              {supportLinks.map((link, idx) => {
                const isInternal = isInternalLink(link.path);
                const cleanPath = getCleanPath(link.path);
                
                return (
                  <li key={idx}>
                    {isInternal ? (
                      <Link to={cleanPath} className="hover:text-emerald-500 transition-colors block py-1">{link.label}</Link>
                    ) : (
                      <a href={link.path} className="hover:text-emerald-500 transition-colors block py-1">{link.label}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">{config.footer?.reachUsLabel || 'Reach Us'}</h4>
            <ul className="space-y-6 text-sm font-medium">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-emerald-500 text-base" aria-hidden="true"></i>
                <span className="leading-relaxed">{config.contact?.address}</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <i className="fa-solid fa-phone text-emerald-500 text-base" aria-hidden="true"></i>
                <span>{config.contact?.phone}</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <i className="fa-solid fa-envelope text-emerald-500 text-base" aria-hidden="true"></i>
                <span className="break-all">{config.contact?.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          <p className="text-center md:text-left">© {new Date().getFullYear()} {config.name}. Professional Educational Entity.</p>
          <p className="mt-6 md:mt-0 text-center md:text-right">{config.footer?.bottomText || 'Standard Excellence Protocol'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
