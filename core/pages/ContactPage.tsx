import React, { useState } from 'react';
import { SiteConfig } from '../types';
import { validateEmail, validateRequired } from '../utils/validation.ts';

interface ContactPageProps {
  config: SiteConfig['contact'];
  social?: SiteConfig['social'];
}

const ContactPage: React.FC<ContactPageProps> = ({ config, social = [] }) => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    const nameErr = validateRequired(name, 'Full Name');
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const msgErr = validateRequired(message, 'Message');
    if (msgErr) newErrors.message = msgErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (validateForm(formData)) {
      setSubmitted(true);
    } else {
      // Mark all as touched to show errors
      setTouched({ name: true, email: true, message: true });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const btnPrimary = "w-full py-6 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] uppercase tracking-widest text-[11px]";
  const labelText = "text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 mb-2 block";
  const errorText = "text-[10px] text-red-500 font-bold mt-1 ml-1";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">24/7 Support Desk</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">Get In Touch</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Have questions about our curriculum or admission process? Our team is ready to guide your future.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 group hover:border-emerald-500 transition-all">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight">Our Campus</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{config.address}</p>
                </div>
              </div>

              <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 group hover:border-emerald-500 transition-all">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-phone" aria-hidden="true"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight">Call Center</h4>
                  <p className="text-slate-500 font-medium">{config.phone}</p>
                  <p className="text-[10px] text-emerald-600 mt-2 uppercase font-black tracking-widest">Mon - Sat, 9am - 6pm</p>
                </div>
              </div>
            </div>

            {social && social.length > 0 && (
              <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 text-center">Digital Footprint</h4>
                <div className="flex flex-wrap gap-4 justify-center">
                  {social.map(item => (
                    <a 
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-500 hover:text-emerald-600 transition-all group"
                    >
                      <i className={`fa-brands ${item.icon} text-xl group-hover:scale-110 transition-transform`} aria-hidden="true"></i>
                      <span className="font-black text-xs uppercase tracking-widest">{item.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[3rem] overflow-hidden shadow-3xl h-96 border-8 border-white group">
              <iframe 
                src={config.mapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Institute Campus Location Map"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>

          <div className="bg-white p-12 md:p-16 rounded-[3.5rem] shadow-3xl border border-slate-100 sticky top-24">
            {submitted ? (
              <div className="text-center py-24" role="alert" aria-live="polite">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-10 shadow-xl animate-bounce">
                  <i className="fa-solid fa-check" aria-hidden="true"></i>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Message Received</h2>
                <p className="text-slate-500 mb-12 text-lg font-medium">Thank you for reaching out. An institutional advisor will contact you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all shadow-2xl active:scale-95"
                >
                  Send New Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10" noValidate>
                <div className="mb-10">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">Send Enquiry</h2>
                  <div className="w-16 h-1.5 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label htmlFor="form-name" className={labelText}>Full Name</label>
                    <input 
                      id="form-name"
                      name="name"
                      required 
                      aria-required="true"
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={touched.name && errors.name ? "error-name" : undefined}
                      type="text" 
                      className={`w-full px-8 py-5 bg-slate-50 border ${touched.name && errors.name ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:border-emerald-500 outline-none transition-all`} 
                      placeholder="e.g. John Doe" 
                      onBlur={() => handleBlur('name')}
                    />
                    {touched.name && errors.name && <span id="error-name" className={errorText}>{errors.name}</span>}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="form-email" className={labelText}>Email Address</label>
                    <input 
                      id="form-email"
                      name="email"
                      required 
                      aria-required="true"
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={touched.email && errors.email ? "error-email" : undefined}
                      type="email" 
                      className={`w-full px-8 py-5 bg-slate-50 border ${touched.email && errors.email ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:border-emerald-500 outline-none transition-all`} 
                      placeholder="john@institute.edu" 
                      onBlur={() => handleBlur('email')}
                    />
                    {touched.email && errors.email && <span id="error-email" className={errorText}>{errors.email}</span>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="form-message" className={labelText}>How can we help?</label>
                  <textarea 
                    id="form-message"
                    name="message"
                    required
                    aria-required="true"
                    aria-invalid={touched.message && !!errors.message}
                    aria-describedby={touched.message && errors.message ? "error-message" : undefined}
                    rows={6} 
                    className={`w-full px-8 py-5 bg-slate-50 border ${touched.message && errors.message ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:border-emerald-500 outline-none transition-all resize-none`} 
                    placeholder="Describe your inquiry..." 
                    onBlur={() => handleBlur('message')}
                  />
                  {touched.message && errors.message && <span id="error-message" className={errorText}>{errors.message}</span>}
                </div>
                <button type="submit" className={btnPrimary}>Submit Official Inquiry</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;