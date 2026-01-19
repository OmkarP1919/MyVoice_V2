
import React, { useState } from 'react';
import { Truck, MapPin, Edit2, CheckCircle, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts';

const SewageRequest: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [address, setAddress] = useState('24-B Green View Colony, Ward 12');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/home'), 3000);
  };

  if (submitted) {
      return (
          <div className="h-[80vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95">
              <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-in zoom-in spin-in-12 duration-700">
                  <CheckCircle size={64} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">{t('request_sent')}!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Vehicle #TR-402 dispatched.<br/>Estimated arrival: <span className="text-indigo-600 font-bold">2 hours</span>.</p>
          </div>
      );
  }

  return (
    <div className="max-w-md mx-auto h-[80vh] flex flex-col animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t('sewage_vehicle')}</h1>
        <p className="text-slate-500 dark:text-slate-400">One-tap request for septic cleaning.</p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        
        {/* Main Action Button */}
        <button 
            onClick={handleSubmit}
            className="group relative w-64 h-64 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 shadow-2xl shadow-orange-300 dark:shadow-orange-900/40 flex flex-col items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
        >
            <div className="absolute inset-0 rounded-full border-[8px] border-white/20 animate-pulse"></div>
            <Truck size={64} className="mb-4 drop-shadow-md group-hover:rotate-3 transition-transform" />
            <span className="text-2xl font-black uppercase tracking-wider drop-shadow-md">{t('request_tanker')}</span>
            <span className="text-sm font-medium opacity-90 mt-1">Tap to confirm</span>
        </button>

        {/* Location Card */}
        <div className="w-full bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mt-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('location')}</span>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    <Edit2 size={12} /> {t('change_location')}
                </button>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                    <Navigation size={20} />
                </div>
                {isEditing ? (
                    <input 
                        autoFocus
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                ) : (
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-tight">{address}</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SewageRequest;
