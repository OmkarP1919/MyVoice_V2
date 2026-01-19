
import React from 'react';
import { User, UserRole } from '../types';
import { Shield, Users, Hammer, MapPin, CheckCircle, Zap } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

const LandingPage: React.FC<Props> = ({ onLogin }) => {
  const roles: { role: UserRole; title: string; desc: string; icon: any; color: string }[] = [
    { 
      role: 'CITIZEN', 
      title: 'Citizen', 
      desc: 'Report issues, track progress, and earn rewards for participation.', 
      icon: Users,
      color: 'bg-emerald-500'
    },
    { 
      role: 'AUTHORITY', 
      title: 'Authority', 
      desc: 'Manage reports, assign tasks, and monitor departmental performance.', 
      icon: Shield,
      color: 'bg-indigo-500'
    },
    { 
      role: 'WORKER', 
      title: 'On-Site Worker', 
      desc: 'Receive tasks, provide updates, and mark issues as resolved.', 
      icon: Hammer,
      color: 'bg-orange-500'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Mock ${role.toLowerCase().replace(/^\w/, c => c.toUpperCase())}`,
      role: role,
      points: 250,
      avatar: `https://picsum.photos/seed/${role}/100/100`
    };
    onLogin(mockUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="absolute top-6 right-6 flex gap-2">
         {/* Simple Lang Switcher for Landing Page */}
      </div>

      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          Civic Issues <span className="text-indigo-600">Simplified.</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          MyVoice is a centralized platform for reporting and resolving local community problems through AI-powered routing and real-time tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {roles.map((item) => (
          <div 
            key={item.role}
            onClick={() => handleRoleSelect(item.role)}
            className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center"
          >
            <div className={`${item.color} w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
              <item.icon size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">{item.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{item.desc}</p>
            <button className="mt-auto w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              Enter as {item.title}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl text-center">
        {[
          { label: 'Issues Resolved', val: '2,450+' },
          { label: 'Active Wards', val: '12' },
          { label: 'Avg. Response', val: '15m' },
          { label: 'Satisfaction', val: '98%' }
        ].map((stat, i) => (
          <div key={i}>
            <div className="text-3xl font-bold text-indigo-600 mb-1">{stat.val}</div>
            <div className="text-slate-500 dark:text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
