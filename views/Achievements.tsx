
import React from 'react';
import { Award, Star, Shield, Zap, Target, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts';

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const achievements = [
    { id: 1, title: 'Civic Guardian', desc: 'Report 10 verified issues', icon: Shield, progress: 100, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { id: 2, title: 'First Responder', desc: 'Report an issue within 1 hour of occurrence', icon: Zap, progress: 100, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 3, title: 'Community Pillar', desc: 'Receive 50 upvotes on your reports', icon: Star, progress: 65, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 4, title: 'Accuracy Master', desc: 'Have 5 reports resolved consecutively', icon: Target, progress: 40, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    { id: 5, title: 'Trend Setter', desc: 'Share a report that gets 10 comments', icon: TrendingUp, progress: 20, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in slide-in-from-right duration-300">
      
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h1>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                  <Award size={32} />
              </div>
              <div>
                  <div className="text-3xl font-black">Level 5</div>
                  <div className="text-yellow-100 font-medium">Master Citizen</div>
              </div>
          </div>
          <div className="mt-6">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span>XP Progress</span>
                  <span>2,450 / 3,000</span>
              </div>
              <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[82%] rounded-full shadow-lg"></div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {achievements.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0`}>
                      <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                          {item.progress === 100 && <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Completed</span>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{item.desc}</p>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default Achievements;
