
import React from 'react';
import { useTheme, useLanguage } from '../contexts';
import { Sun, Moon, Globe, Bell, Shield, Smartphone } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('settings')}</h1>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Preferences</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Customize your app experience.</p>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Appearance</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{theme === 'light' ? t('theme_light') : t('theme_dark')}</p>
              </div>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Language</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Select your preferred language</p>
              </div>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          <div className="p-6 flex items-center justify-between opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Notifications</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Push notifications for updates</p>
              </div>
            </div>
            <div className="w-14 h-8 bg-indigo-600 rounded-full relative">
              <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-slate-400 text-sm py-4">
        App Version 2.4.0
      </div>
    </div>
  );
};

export default Settings;
