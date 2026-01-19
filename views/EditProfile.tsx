
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useLanguage } from '../contexts';
import { ArrowLeft, Camera, Save, User as UserIcon, Mail, Phone, MapPin } from 'lucide-react';

interface Props {
  user: User;
}

const EditProfile: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
      name: user.name,
      email: 'user@example.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, India'
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Logic to update user context/localstorage would go here
      navigate('/profile');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20 animate-in slide-in-from-right duration-300">
       <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('edit_profile')}</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-8">
              <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800">
                      <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 border-4 border-white dark:border-slate-900">
                      <Camera size={16} />
                  </button>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('name')}</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <UserIcon size={20} className="text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="bg-transparent w-full focus:outline-none text-slate-900 dark:text-white font-medium"
                      />
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('email')}</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <Mail size={20} className="text-slate-400" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="bg-transparent w-full focus:outline-none text-slate-900 dark:text-white font-medium"
                      />
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('phone')}</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <Phone size={20} className="text-slate-400" />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="bg-transparent w-full focus:outline-none text-slate-900 dark:text-white font-medium"
                      />
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('address')}</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <MapPin size={20} className="text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="bg-transparent w-full focus:outline-none text-slate-900 dark:text-white font-medium"
                      />
                  </div>
              </div>

              <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                      <Save size={20} /> {t('save_changes')}
                  </button>
              </div>
          </form>
      </div>
    </div>
  );
};

export default EditProfile;
