
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AppState } from '../types.ts';

interface EnrollmentPageProps {
  content: AppState;
}

const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ content }) => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { 
    enrollmentForm = { title: 'Enrollment Form', fields: [], roadmapSteps: [] }, 
    courses, 
    site = { contact: { phone: 'N/A' } } 
  } = content || {};

  useEffect(() => {
    if (!enrollmentForm?.fields) return;
    const initialData: Record<string, string> = {};
    enrollmentForm.fields.forEach(field => { if (field?.id) initialData[field.id] = ''; });
    const courseFromUrl = searchParams.get('course');
    if (courseFromUrl) {
      const courseField = enrollmentForm.fields.find(f => f.type === 'course-select');
      if (courseField?.id) initialData[courseField.id] = decodeURIComponent(courseFromUrl);
    }
    setFormData(initialData);
  }, [enrollmentForm, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData['f1'] || 'Anonymous',
          email: formData['f2'] || '',
          phone: formData['f5'] || '000-000-0000',
          course: formData['f9'] || 'N/A',
          message: formData['f12'] || 'New Enrollment Application',
          source: 'enrollment',
          details: { ...formData }
        })
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(result.message || 'Application rejected by server.');
      }
    } catch (err) {
      setErrorMessage('Network error: Is the backend server running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (id: string, value: string) => { 
    setFormData(prev => ({ ...prev, [id]: value })); 
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24">
        <div className="max-w-2xl w-full bg-white p-12 md:p-16 rounded-[3.5rem] shadow-3xl text-center border border-slate-100">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center text-4xl md:text-5xl mx-auto mb-10 shadow-2xl animate-bounce">
            <i className="fa-solid fa-check"></i>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">Application Received</h2>
          <p className="text-slate-600 mb-12 text-lg md:text-xl font-medium leading-relaxed">We will contact you within 48 hours.</p>
          <Link to="/courses" className="inline-block px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-3xl active:scale-95 uppercase tracking-widest text-[11px]">Return to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-32 pb-24 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-7xl font-black mb-8">{enrollmentForm.title}</h1>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 pb-32">
        <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          <div className="flex-grow p-10 md:p-16 lg:p-20">
            {errorMessage && <div className="mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {(enrollmentForm.fields || []).map(field => (
                  <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] ml-1 block">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea required={field.required} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none" />
                    ) : (
                      <input required={field.required} type={field.type} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none" />
                    )}
                  </div>
                ))}
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-6 md:py-8 bg-emerald-600 text-white font-black rounded-3xl hover:bg-emerald-700 transition-all uppercase tracking-[0.2em] shadow-2xl">
                {isSubmitting ? 'Processing...' : 'Submit Admission Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
