
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useTheme } from '../contexts';
import { 
  Home, PlusSquare, BarChart2, Settings, LogOut, Bell, Award, 
  User as UserIcon, FileText, Sun, Moon, Plus, Menu, X,
  Users, CheckCircle, ClipboardList, Camera, LayoutGrid, Circle
} from 'lucide-react';
import { ChatBot } from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Title Logic
  const getPageTitle = () => {
      if (location.pathname === '/report') return 'Camera';
      if (location.pathname === '/dashboard') return 'Feed';
      if (location.pathname === '/home') return 'Services';
      if (location.pathname === '/sewage-request') return 'Request Vehicle';
      if (location.pathname === '/achievements') return 'Achievements';
      if (location.pathname === '/help-support') return 'Help & Support';
      return location.pathname.replace('/', '').charAt(0).toUpperCase() + location.pathname.slice(2).replace('-', ' ');
  };

  // Determine if ChatBot should be visible (Only on Home)
  const showChatBot = location.pathname === '/home';

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className={`px-4 space-y-1 py-2 ${mobile ? '' : 'overflow-y-auto custom-scrollbar flex-1'}`}>
        {user.role === 'CITIZEN' ? (
           <>
            <Link 
              to="/home" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/home')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <LayoutGrid size={20} strokeWidth={isActive('/home') ? 2.5 : 2} />
              <span>Services</span>
            </Link>

             <Link 
              to="/dashboard" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/dashboard')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <Home size={20} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
              <span>Community Feed</span>
            </Link>

            <Link 
              to="/report" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/report')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <Camera size={20} strokeWidth={isActive('/report') ? 2.5 : 2} />
              <span>Camera</span>
            </Link>
           </>
        ) : (
          <Link 
            to="/dashboard" 
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
              isActive('/dashboard')
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
            }`}
          >
            <Home size={20} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
            <span>{user.role === 'WORKER' ? 'My Tasks' : 'Command Center'}</span>
          </Link>
        )}

        {user.role === 'CITIZEN' && (
          <>
            <Link 
              to="/my-reports" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/my-reports')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <FileText size={20} strokeWidth={isActive('/my-reports') ? 2.5 : 2} />
              <span>My Activity</span>
            </Link>

            <Link 
              to="/rewards" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/rewards')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <Award size={20} strokeWidth={isActive('/rewards') ? 2.5 : 2} />
              <span>Rewards Store</span>
            </Link>
          </>
        )}

        {/* ... Authority/Worker logic omitted for brevity as it remains same, only Citizen part highlighted in diff ... */}
        {(user.role === 'AUTHORITY') && (
           <>
            <Link 
              to="/analytics" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/analytics')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <BarChart2 size={20} strokeWidth={isActive('/analytics') ? 2.5 : 2} />
              <span>Analytics</span>
            </Link>
            
            <Link 
              to="/reports-log" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/reports-log')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <ClipboardList size={20} strokeWidth={isActive('/reports-log') ? 2.5 : 2} />
              <span>Reports Log</span>
            </Link>

            <Link 
              to="/manage-staff" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/manage-staff')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <Users size={20} strokeWidth={isActive('/manage-staff') ? 2.5 : 2} />
              <span>Manage Staff</span>
            </Link>
           </>
        )}

        {user.role === 'WORKER' && (
           <Link 
              to="/work-history" 
              onClick={() => mobile && setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                isActive('/work-history')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <CheckCircle size={20} strokeWidth={isActive('/work-history') ? 2.5 : 2} />
              <span>Work History</span>
            </Link>
        )}
        
        <div className="my-4 border-t border-slate-100 dark:border-slate-800 mx-4"></div>
        
        <div className="px-2 mb-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Account</p>
        </div>
        
        <Link 
          to="/profile" 
          onClick={() => mobile && setIsMobileMenuOpen(false)}
          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
            isActive('/profile')
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
          }`}
        >
          <UserIcon size={20} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          <span>My Profile</span>
        </Link>

        <Link 
          to="/settings" 
          onClick={() => mobile && setIsMobileMenuOpen(false)}
          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
            isActive('/settings')
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
          }`}
        >
          <Settings size={20} strokeWidth={isActive('/settings') ? 2.5 : 2} />
          <span>Settings</span>
        </Link>
      </div>
    </>
  );

  // Mobile Bottom Tab Item
  const TabItem = ({ to, icon: Icon, label }: { to: string, icon: any, label?: string }) => (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive(to) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
      <Icon size={24} strokeWidth={isActive(to) ? 2.5 : 2} className="transition-transform active:scale-90" />
      {label && <span className="text-[10px] font-bold tracking-tight">{label}</span>}
    </Link>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full z-20 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 transform rotate-3">MV</div>
          <div>
             <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white block leading-none">MyVoice</span>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Civic Connect</span>
          </div>
        </div>

        <div className="px-6 mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Menu</p>
        </div>

        <NavContent />

        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-4 flex items-center gap-3">
             <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700" alt="Avatar" />
             <div className="overflow-hidden">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
             </div>
          </div>
          <button onClick={() => { onLogout(); navigate('/'); }} className="flex items-center justify-center gap-2 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-bold text-sm">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-72 bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
             <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">MV</div>
                  <span className="font-bold text-slate-900 dark:text-white text-lg">MyVoice</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto py-4">
               <NavContent mobile={true} />
             </div>

             <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => { onLogout(); navigate('/'); }} className="flex items-center gap-3 text-red-500 font-bold">
                  <LogOut size={20} /> Sign Out
                </button>
             </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        {/* Mobile Header (Hide if on Camera/Report page for immersive feel) */}
        {location.pathname !== '/report' && (
          <header className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 transition-all">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Menu size={24} />
              </button>
              <span className="font-bold text-slate-900 dark:text-white text-lg">
                {getPageTitle()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              
              {/* Mobile Notification Button */}
              <div className="relative">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                    <Bell size={18} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                </button>
                {showNotifications && (
                   <div className="absolute right-0 top-12 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in zoom-in-95 origin-top-right">
                       <h3 className="font-bold text-sm px-3 py-2 border-b border-slate-100 dark:border-slate-800">Notifications</h3>
                       <div className="max-h-60 overflow-y-auto">
                           <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                               <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    <span className="text-xs font-bold text-indigo-500">Status Update</span>
                               </div>
                               <p className="text-xs text-slate-600 dark:text-slate-300">Your issue #A82 has been resolved!</p>
                           </div>
                           <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                               <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-bold text-emerald-500">Reward</span>
                               </div>
                               <p className="text-xs text-slate-600 dark:text-slate-300">You earned 50 Karma points.</p>
                           </div>
                       </div>
                       <div className="border-t border-slate-100 dark:border-slate-800 p-2 text-center">
                           <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-slate-400 hover:text-indigo-600">Close</button>
                       </div>
                   </div> 
                )}
              </div>
            </div>
          </header>
        )}

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-5 items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-500 dark:text-slate-400">
                   {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
             </div>
             
             {/* Desktop Notification Button */}
             <div className="relative">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 dark:text-slate-400 relative"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                </button>
                 {showNotifications && (
                   <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in zoom-in-95 origin-top-right">
                       <h3 className="font-bold text-sm px-3 py-2 border-b border-slate-100 dark:border-slate-800">Notifications</h3>
                       <div className="max-h-60 overflow-y-auto">
                           <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
                               <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    <span className="text-xs font-bold text-indigo-500">Status Update</span>
                               </div>
                               <p className="text-sm text-slate-600 dark:text-slate-300">Your report regarding 'Main St Pothole' has been marked as Resolved.</p>
                               <span className="text-[10px] text-slate-400 block mt-1">2 hours ago</span>
                           </div>
                           <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
                               <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-bold text-emerald-500">Reward Unlocked</span>
                               </div>
                               <p className="text-sm text-slate-600 dark:text-slate-300">You earned 'Silver Tier' badge!</p>
                               <span className="text-[10px] text-slate-400 block mt-1">1 day ago</span>
                           </div>
                       </div>
                   </div> 
                )}
             </div>

             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

             <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{user.points} Karma Pts</p>
                </div>
                <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" alt="avatar" />
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className={`flex-1 overflow-y-auto ${location.pathname === '/report' ? 'p-0 md:p-8' : 'p-4 md:p-8'} custom-scrollbar pb-24 md:pb-8`}>
          <div className="max-w-4xl mx-auto md:max-w-6xl w-full h-full">
            {children}
          </div>
        </main>
        
        {/* ChatBot - Only visible on Home */}
        {showChatBot && <ChatBot />}

        {/* Mobile Bottom Navigation */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 h-[80px] px-6 pb-2 pt-1 flex items-center justify-between z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] ${location.pathname === '/report' ? 'hidden' : ''}`}>
          {user.role === 'CITIZEN' ? (
             <>
               <TabItem to="/home" icon={LayoutGrid} label="Home" />
               <TabItem to="/dashboard" icon={Home} label="Feed" />
               <div className="-mt-12 relative z-50">
                 <Link to="/report" className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-300 dark:shadow-indigo-900/50 hover:scale-105 transition-all">
                   <Camera size={32} />
                 </Link>
               </div>
               <TabItem to="/my-reports" icon={FileText} label="Activity" />
               <TabItem to="/profile" icon={UserIcon} label="Profile" />
             </>
          ) : user.role === 'WORKER' ? (
             <>
               <TabItem to="/dashboard" icon={Home} label="Tasks" />
               <TabItem to="/work-history" icon={CheckCircle} label="History" />
               <TabItem to="/profile" icon={UserIcon} label="Profile" />
               <TabItem to="/settings" icon={Settings} label="Settings" />
             </>
          ) : (
             <>
               <TabItem to="/dashboard" icon={Home} label="Command" />
               <TabItem to="/reports-log" icon={ClipboardList} label="Reports" />
               <TabItem to="/analytics" icon={BarChart2} label="Stats" />
               <TabItem to="/manage-staff" icon={Users} label="Staff" />
             </>
          )}
        </div>
      </div>
    </div>
  );
};
