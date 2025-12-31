
import React, { useState } from 'react';

interface ContactPageProps {
  config: {
    email: string;
    phone: string;
    address: string;
    mapUrl: string;
  };
}

const ContactPage: React.FC<ContactPageProps> = ({ config }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-6">Let's Connect</h1>
            <p className="text-slate-600 mb-12 text-lg">
              Have questions about our curriculum or admission process? Our team is ready to help you navigate your future.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">Our Campus</h4>
                  <p className="text-slate-500 leading-relaxed">{config.address}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">Call Us</h4>
                  <p className="text-slate-500">{config.phone}</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-tighter">Mon - Sat, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">Email Support</h4>
                  <p className="text-slate-500">{config.email}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl h-80 border-4 border-white">
              <iframe 
                src={config.mapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Institute Location"
              ></iframe>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
            {submitted ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Message Received!</h2>
                <p className="text-slate-500 mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Send an Enquiry</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interested Course</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all">
                    <option>General Enquiry</option>
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Cyber Security</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Message</label>
                  <textarea 
                    rows={5}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
