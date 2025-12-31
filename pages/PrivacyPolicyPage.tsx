
import React from 'react';

interface PrivacyPolicyPageProps {
  siteName: string;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ siteName }) => {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Simple Header */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </section>

      {/* Policy Content */}
      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <div className="prose prose-slate lg:prose-lg mx-auto space-y-10 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Introduction</h2>
            <p>
              Welcome to <strong>{siteName}</strong>. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at our provided support email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website (such as by posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, and educational background provided via enrollment forms.</li>
              <li><strong>Usage Data:</strong> Information automatically collected when you visit our site, such as IP addresses, browser types, and pages visited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our Website for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To send administrative information to you.</li>
              <li>To fulfill and manage your enrollment applications.</li>
              <li>To respond to user inquiries and offer support.</li>
              <li>For our internal marketing and promotional purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Sharing Your Information</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Data Security</h2>
            <p>
              We aim to protect your personal information through a system of organizational and technical security measures. However, please remember that no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">6. Your Privacy Rights</h2>
            <p>
              In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time by contacting us.
            </p>
          </section>

          <section className="pt-10 border-t border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">7. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at our official support address listed on the contact page or call our campus directly.
            </p>
          </section>
        </div>

        <div className="mt-20 text-center">
          <a href="#/" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-4 transition-all">
            <i className="fa-solid fa-arrow-left"></i> Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
