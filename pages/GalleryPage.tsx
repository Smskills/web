
import React, { useState } from 'react';
import { GalleryItem } from '../types';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', ...new Set(gallery.map(item => item.category))];
  
  const filtered = activeCategory === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-6 tracking-tight">Campus Life & Events</h1>
          <p className="text-slate-500 max-w-2xl mx-auto mb-10">
            A glimpse into our state-of-the-art facilities and vibrant student community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map(item => (
            <div 
              key={item.id} 
              className="relative group overflow-hidden rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-2xl transition-all break-inside-avoid"
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-emerald-400 text-xs font-black uppercase mb-1">{item.category}</span>
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-40">
            <p className="text-slate-400">No images in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
