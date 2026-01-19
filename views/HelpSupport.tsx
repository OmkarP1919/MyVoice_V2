
import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpSupport: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { id: 1, q: "How do I earn Karma Points?", a: "You earn points by reporting genuine issues, having them verified, and when they are resolved. You also get points for helpful comments." },
    { id: 2, q: "Who verifies the reported issues?", a: "Our AI system does the first pass, followed by community upvotes, and finally verification by the municipal authority." },
    { id: 3, q: "Is my identity anonymous?", a: "Yes, you can choose to report anonymously in the settings. By default, only your username is shown." },
    { id: 4, q: "How long does a resolution take?", a: "Timelines vary by department and priority. You can track the estimated time in the Issue Details page." },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in slide-in-from-right duration-300">
       <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
          <p className="text-indigo-100 mb-6">Our team is available 24/7 to assist you.</p>
          <div className="flex justify-center gap-4">
             <button className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors w-24">
                <Phone size={24} />
                <span className="text-xs font-bold">Call</span>
             </button>
             <button className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors w-24">
                <Mail size={24} />
                <span className="text-xs font-bold">Email</span>
             </button>
             <button className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors w-24">
                <MessageCircle size={24} />
                <span className="text-xs font-bold">Chat</span>
             </button>
          </div>
      </div>

      <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileQuestion size={20} className="text-indigo-500" /> Frequently Asked Questions
          </h3>
          <div className="space-y-3">
              {faqs.map((faq) => (
                  <div key={faq.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                      <button 
                        onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-800 dark:text-slate-200"
                      >
                          {faq.q}
                          {openFaq === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {openFaq === faq.id && (
                          <div className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                              {faq.a}
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default HelpSupport;
