
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

    // Intelligent Extraction: Find the best matching field for DB columns
    const findValueByKeywords = (keywords: string[]) => {
      const field = enrollmentForm.fields.find(f => 
        keywords.some(k => (f.label || '').toLowerCase().includes(k))
      );
      return field ? formData[field.id] : null;
    };

    const findValueByType = (type: string) => {
      const field = enrollmentForm.fields.find(f => f.type === type);
      return field ? formData[field.id] : null;
    };

    const fullName = findValueByKeywords(['student full name', 'full name', 'student name']) || findValueByKeywords(['name']) || 'Anonymous';
    const email = findValueByType('email') || findValueByKeywords(['email']) || '';
    const phone = findValueByType('tel') || findValueByKeywords(['phone', 'contact', 'mobile']) || '000-000-0000';
    const course = findValueByType('course-select') || findValueByKeywords(['course', 'program', 'track']) || 'N/A';
    const message = findValueByKeywords(['remarks', 'questions', 'message']) || findValueByType('textarea') || 'New Enrollment Application';
    
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          course,
          message,
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
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{enrollmentForm.title}</h1>
          <p className="text-slate-400 text-lg font-medium">{enrollmentForm.description}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 pb-32">
        <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          
          <div className="bg-slate-900 lg:w-96 p-10 md:p-14 text-white shrink-0">
             <h3 className="text-xl md:text-2xl font-black mb-12 text-white uppercase tracking-tighter border-b border-white/5 pb-6">
                {enrollmentForm.roadmapTitle || 'Process'}
              </h3>
              <div className="space-y-12">
                {(enrollmentForm.roadmapSteps || []).map((step, idx) => (
                  <div key={step.id} className="relative flex gap-8 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xl relative z-20 border border-emerald-400/30">
                      {idx + 1}
                    </div>
                    <div className="flex-grow pt-1">
                      <h4 className="font-black text-lg uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">{step.title}</h4>
                      <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          <div className="flex-grow p-10 md:p-16 lg:p-20">
            {errorMessage && <div className="mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-10">
                {(enrollmentForm.fields || []).map(field => {
                   const isWide = field.type === 'textarea' || (field.label && (field.label.toLowerCase().includes('name') || field.label.toLowerCase().includes('address')));
                   return (
                    <div key={field.id} className={`space-y-2 ${isWide ? 'md:col-span-2' : ''}`}>
                      <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] ml-1 block">
                        {field.label} {field.required && <span className="text-emerald-600">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea required={field.required} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-900 resize-none placeholder-slate-400 shadow-sm" placeholder={field.placeholder} />
                      ) : field.type === 'course-select' ? (
                        <div className="relative">
                          <select required={field.required} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-black text-[11px] text-slate-900 uppercase tracking-widest appearance-none pr-12 shadow-sm cursor-pointer">
                            <option value="">{field.placeholder || 'Select Track'}</option>
                            {(courses?.list || []).filter(c => c.status === 'Active').map(course => (
                              <option key={course.id} value={course.name}>{course.name}</option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                        </div>
                      ) : field.type === 'select' ? (
                        <div className="relative">
                          <select required={field.required} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-black text-[11px] text-slate-900 uppercase tracking-widest appearance-none pr-12 shadow-sm cursor-pointer">
                            <option value="">{field.placeholder || 'Choose Option'}</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                        </div>
                      ) : (
                        <input required={field.required} type={field.type} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-sm" placeholder={field.placeholder} />
                      )}
                    </div>
                  );
                })}
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full py-6 md:py-8 bg-emerald-600 text-white font-black rounded-3xl hover:bg-emerald-700 transition-all uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 active:scale-[0.98]">
                {isSubmitting ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing Application</> : <>Submit Admission Request <i className="fa-solid fa-paper-plane text-sm"></i></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
