
import React from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white text-xl font-bold mb-4">{config.name}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering professional education for over a decade. Built on quality and results.
            </p>
            <div className="flex space-x-4">
              {config.social.facebook && (
                <a href={config.social.facebook} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              )}
              {config.social.twitter && (
                <a href={config.social.twitter} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                  <i className="fa-brands fa-twitter"></i>
                </a>
              )}
              {config.social.linkedin && (
                <a href={config.social.linkedin} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-700 hover:text-white transition-all">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              {config.navigation.map(nav => (
                <li key={nav.label}>
                  <a href={nav.path} className="hover:text-white transition-colors">{nav.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Guidance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Affiliate Program</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">Reach Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-emerald-500"></i>
                <span>{config.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-emerald-500"></i>
                <span>{config.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-emerald-500"></i>
                <span>{config.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:row items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {config.name}. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Design & Architecture by Senior Architect</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
