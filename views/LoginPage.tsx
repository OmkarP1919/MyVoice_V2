
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Hammer, ArrowRight, Lock, Mail, Eye, EyeOff, Radio, Hexagon, Zap, ShieldCheck } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'u1',
        name: email.split('@')[0] || 'John Doe',
        role: 'CITIZEN',
        points: 350,
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
      };
      onLogin(mockUser);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
        const mockUser: User = {
            id: 'g_user',
            name: 'Google User',
            role: 'CITIZEN',
            points: 100,
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        };
        onLogin(mockUser);
    }, 1000);
  };

  const handleQuickRole = (role: UserRole) => {
    const mockUser: User = {
      // Use fixed ID for WORKER so they can see the assigned mock tasks
      id: role === 'WORKER' ? 'WORKER_01' : Math.random().toString(36).substr(2, 9),
      name: `Demo ${role.charAt(0) + role.slice(1).toLowerCase()}`,
      role: role,
      points: role === 'CITIZEN' ? 120 : 0,
      avatar: `https://i.pravatar.cc/150?u=${role}`
    };
    onLogin(mockUser);
  };

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 flex relative overflow-hidden transition-colors duration-500">
      
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-indigo-600/5 -skew-x-12 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-8 md:gap-16 z-10 h-full">
        
        {/* Left Side: Hero/Branding (Hidden on small mobile to ensure fit) */}
        <div className="hidden md:flex flex-1 flex-col justify-center space-y-8">
           <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 p-4 pr-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 w-fit animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-indigo-600 rounded-xl rotate-6 opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Radio size={24} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">MyVoice</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Civic Connect</p>
              </div>
           </div>

           <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Better Cities,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Better Lives.</span>
           </h1>
           <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Join the platform that connects citizens with authorities for faster, transparent resolution of civic issues.
           </p>

           <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                     </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-800 text-white flex items-center justify-center text-xs font-bold">+2k</div>
              </div>
              <div className="text-sm font-bold text-slate-500">Active Citizens</div>
           </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full md:w-[440px] flex flex-col h-full md:h-auto justify-center">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-700">
                <div className="md:hidden flex flex-col items-center gap-2 mb-8 justify-center">
                    <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-2">
                        <Radio size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">MyVoice</h2>
                </div>

                <div className="mb-6 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please enter your details to sign in.</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-3.5 pl-12 pr-4 font-medium outline-none transition-all dark:text-white"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-3.5 pl-12 pr-12 font-medium outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="text-right">
                             <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</a>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-base shadow-xl shadow-slate-200 dark:shadow-none"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={20} />
                        </button>
                    </div>
                </form>

                {/* Google Login - Moved Below */}
                <div className="mt-4">
                     <button 
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                            <path fill="#EA4335" d="M12 4.36c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.05 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">Don't have an account? <button className="font-bold text-indigo-600 hover:underline">Sign Up</button></p>
                </div>

            </div>

             {/* Big Worker Mode Button */}
             <button 
                onClick={() => handleQuickRole('WORKER')}
                className="mt-6 w-full bg-indigo-600 dark:bg-indigo-900/30 p-4 rounded-2xl flex items-center justify-between group hover:bg-indigo-700 transition-colors border border-indigo-500/20 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                        <Hammer size={24} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-white text-base">Worker / Authority Mode</h3>
                        <p className="text-indigo-100 text-xs">Access field tasks & dashboard</p>
                    </div>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={16} />
                </div>
            </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
