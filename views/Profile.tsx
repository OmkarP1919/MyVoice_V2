
import React from 'react';
import { User } from '../types';
import { useLanguage } from '../contexts';
import { User as UserIcon, Mail, Phone, MapPin, Award, Edit3, Shield, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  user: User;
}

const Profile: React.FC<Props> = ({ user }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Digital ID Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-900 dark:to-slate-900 rounded-3xl p-6 shadow-2xl shadow-indigo-200 dark:shadow-none text-white">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

          <div className="relative z-10 flex flex-col items-center">
              <div className="absolute top-0 right-0 p-2">
                  <Link to="/edit-profile" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors block">
                      <Edit3 size={18} />
                  </Link>
              </div>

              <div className="w-24 h-24 p-1 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                  <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-200" />
              </div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center gap-2 text-indigo-100 text-sm mb-6 bg-white/10 px-3 py-1 rounded-full mt-2">
                  <Shield size={12} />
                  <span className="uppercase tracking-widest font-bold text-xs">{user.role}</span>
              </div>

              <div className="grid grid-cols-3 w-full gap-4 text-center border-t border-white/10 pt-6">
                  <div>
                      <div className="text-2xl font-black">{user.points}</div>
                      <div className="text-[10px] uppercase tracking-wider text-indigo-200">{t('points')}</div>
                  </div>
                  <div className="border-l border-r border-white/10">
                      <div className="text-2xl font-black">12</div>
                      <div className="text-[10px] uppercase tracking-wider text-indigo-200">Reports</div>
                  </div>
                  <div>
                      <div className="text-2xl font-black">5</div>
                      <div className="text-[10px] uppercase tracking-wider text-indigo-200">Badges</div>
                  </div>
              </div>
          </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="space-y-4">
               <div className="flex items-center gap-4 p-2">
                   <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                       <Mail size={18} />
                   </div>
                   <div>
                       <p className="text-xs text-slate-400 font-bold uppercase">{t('email')}</p>
                       <p className="text-sm font-medium text-slate-900 dark:text-white">user@example.com</p>
                   </div>
               </div>
               <div className="flex items-center gap-4 p-2">
                   <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                       <MapPin size={18} />
                   </div>
                   <div>
                       <p className="text-xs text-slate-400 font-bold uppercase">{t('location')}</p>
                       <p className="text-sm font-medium text-slate-900 dark:text-white">Mumbai, India</p>
                   </div>
               </div>
          </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <Link to="/settings" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                      <Settings size={18} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{t('settings')}</span>
              </div>
          </Link>
          <Link to="/achievements" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 cursor-pointer">
              <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                      <Award size={18} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">Achievements</span>
              </div>
          </Link>
          <Link to="/help-support" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                      <HelpCircle size={18} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">Help & Support</span>
              </div>
          </Link>
      </div>

    </div>
  );
};

export default Profile;
