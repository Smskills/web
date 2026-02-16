
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
  const primaryPhone = Array.isArray(config.contact?.phones) ? config.contact.phones[0] : 'N/A';

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
    <footer className="bg-[#0b1121] text-slate-400 pt-20 pb-10 border-t border-slate-800/50 font-sans">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="space-y-8">
            <h3 className="text-white text-4xl font-black tracking-tighter uppercase">
              {config.name}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              {config.footer?.brandDescription || 'S M Skills is a premier center for technical education, providing industry-aligned training designed for immediate employability.'}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(social => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500"
                  title={social.platform}
                  aria-label={`Follow us on ${social.platform}`}
                >
                  <i className={`fa-brands ${social.icon} text-lg`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.3em] mb-10 opacity-90">
              {config.footer?.quickLinksLabel || 'Navigation'}
            </h4>
            <ul className="space-y-5 text-sm font-bold">
              {navigationLinks.map(nav => {
                const isInternal = isInternalLink(nav.path);
                return (
                  <li key={nav.label}>
                    {isInternal ? (
                      <Link to={getCleanPath(nav.path)} className="hover:text-emerald-400 transition-colors block">{nav.label}</Link>
                    ) : (
                      <a href={nav.path} className="hover:text-emerald-400 transition-colors block">{nav.label}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.3em] mb-10 opacity-90">
              {config.footer?.supportLinksLabel || 'Resources'}
            </h4>
            <ul className="space-y-5 text-sm font-bold">
              {supportLinks.map((link, idx) => {
                const isInternal = isInternalLink(link.path);
                const cleanPath = getCleanPath(link.path);
                
                return (
                  <li key={idx}>
                    {isInternal ? (
                      <Link to={cleanPath} className="hover:text-emerald-400 transition-colors block">{link.label}</Link>
                    ) : (
                      <a href={link.path} className="hover:text-emerald-400 transition-colors block">{link.label}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-[0.3em] mb-10 opacity-90">
              {config.footer?.reachUsLabel || 'Connect'}
            </h4>
            <ul className="space-y-8 text-sm font-bold">
              <li className="flex gap-4 group">
                <div className="mt-1 w-5 flex justify-center text-emerald-500 transition-transform group-hover:scale-125">
                  <i className="fa-solid fa-location-dot text-base" aria-hidden="true"></i>
                </div>
                <span className="leading-relaxed text-slate-300">{config.contact?.address}</span>
              </li>
              <li className="flex gap-4 group">
                <div className="w-5 flex justify-center text-emerald-500 transition-transform group-hover:scale-125">
                  <i className="fa-solid fa-phone text-base" aria-hidden="true"></i>
                </div>
                <span className="text-slate-300">{primaryPhone}</span>
              </li>
              <li className="flex gap-4 group">
                <div className="w-5 flex justify-center text-emerald-500 transition-transform group-hover:scale-125">
                  <i className="fa-solid fa-envelope text-base" aria-hidden="true"></i>
                </div>
                <span className="break-all text-slate-300">{config.contact?.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-10 flex flex-col md:flex-row items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} {config.name}. PROFESSIONAL EDUCATIONAL ENTITY.
          </p>
          <p className="mt-6 md:mt-0 text-center md:text-right">
            {config.footer?.bottomText || 'S M SKILLS • ESTD 2024'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
