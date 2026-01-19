
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Truck, FileText, Gift, LayoutGrid, Phone, ChevronRight, X, AlertTriangle, PhoneCall } from 'lucide-react';
import { useLanguage } from '../contexts';
import { User } from '../types';

interface Props {
  user: User;
}

const HomeGrid: React.FC<Props> = ({ user }) => {
  const { t } = useLanguage();
  const [showSOS, setShowSOS] = useState(false);

  const menuItems = [
    { 
      title: 'Submit Issue', 
      desc: 'Report pothole, garbage, etc.', 
      icon: Camera, 
      color: 'bg-indigo-600', 
      link: '/report',
      cols: 'col-span-2' 
    },
    { 
      title: 'Sewage Vehicle', 
      desc: 'Request cleaning truck', 
      icon: Truck, 
      color: 'bg-orange-500', 
      link: '/sewage-request',
      cols: 'col-span-1'
    },
    { 
      title: 'Community Feed', 
      desc: 'See what\'s happening', 
      icon: LayoutGrid, 
      color: 'bg-purple-500', 
      link: '/dashboard',
      cols: 'col-span-1'
    },
    { 
      title: 'My Reports', 
      desc: 'Track status', 
      icon: FileText, 
      color: 'bg-emerald-500', 
      link: '/my-reports',
      cols: 'col-span-1'
    },
    { 
      title: 'Rewards', 
      desc: 'Redeem points', 
      icon: Gift, 
      color: 'bg-pink-500', 
      link: '/rewards',
      cols: 'col-span-1'
    },
  ];

  return (
    <div className="flex flex-col h-full pb-20 pt-2 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Welcome Header - Compact */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Hello, <span className="text-indigo-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">How can we help?</p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
           <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-3 content-start">
        {menuItems.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.link} 
            className={`relative overflow-hidden group rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all ${item.cols}`}
          >
            <div className={`absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity`}>
               <item.icon size={60} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-2">
              <div className={`w-10 h-10 ${item.color} text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight mb-0.5">{item.title}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}

        {/* Emergency Section */}
         <button 
            onClick={() => setShowSOS(true)}
            className="col-span-2 bg-red-50 dark:bg-red-900/10 rounded-2xl p-4 flex items-center justify-between border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
         >
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-none animate-pulse">
                <Phone size={20} />
            </div>
            <div className="text-left">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Emergency</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Police, Fire, Ambulance</p>
            </div>
            </div>
            <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                <ChevronRight size={16} />
            </div>
        </button>
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowSOS(false)}></div>
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={24} fill="currentColor" className="text-red-100" />
                        <span className="font-black text-xl">EMERGENCY</span>
                    </div>
                    <button onClick={() => setShowSOS(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-3">
                    <a href="tel:100" className="flex items-center justify-between w-full p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-colors shadow-lg shadow-red-500/30">
                        <div className="flex items-center gap-3">
                            <PhoneCall size={24} />
                            <div className="text-left">
                                <div className="font-bold text-lg">POLICE</div>
                                <div className="text-xs opacity-80">Call 100</div>
                            </div>
                        </div>
                        <ChevronRight />
                    </a>
                    
                    <a href="tel:102" className="flex items-center justify-between w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 rounded-2xl transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                                <Truck size={20} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-orange-600">AMBULANCE</div>
                                <div className="text-xs text-slate-500">Call 102</div>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-orange-500" />
                    </a>

                    <a href="tel:101" className="flex items-center justify-between w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 rounded-2xl transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-red-600">FIRE BRIGADE</div>
                                <div className="text-xs text-slate-500">Call 101</div>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-red-500" />
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default HomeGrid;
