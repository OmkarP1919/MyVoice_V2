
import React, { useState } from 'react';
import { Gift, Lock, Star, CreditCard, Ticket, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts';

const Rewards: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'redeem' | 'history'>('redeem');

    const rewards = [
        { id: 1, title: 'Metro Pass (Weekly)', cost: 500, icon: '🚇', type: 'Transport', color: 'bg-blue-500' },
        { id: 2, title: 'Cinema Voucher', cost: 1200, icon: '🍿', type: 'Entertainment', color: 'bg-red-500' },
        { id: 3, title: 'Tax Rebate 5%', cost: 5000, icon: '🏛️', type: 'Government', color: 'bg-emerald-600' },
        { id: 4, title: 'Plant a Tree', cost: 300, icon: '🌳', type: 'Environment', color: 'bg-green-500' },
        { id: 5, title: 'Coffee Shop Gift', cost: 800, icon: '☕', type: 'Food', color: 'bg-amber-600' },
        { id: 6, title: 'Library Access', cost: 400, icon: '📚', type: 'Education', color: 'bg-indigo-500' },
    ];

    const history = [
        { id: 101, title: 'Metro Pass (Weekly)', cost: 500, date: '12 Oct 2023', code: 'MV-METRO-882' },
        { id: 102, title: 'Coffee Shop Gift', cost: 800, date: '05 Sep 2023', code: 'MV-COFFEE-991' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Wallet Header */}
            <div className="relative bg-slate-900 rounded-[2rem] p-8 text-white overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-50 -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600 rounded-full blur-[60px] opacity-40 -ml-10 -mb-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <p className="text-slate-400 font-medium mb-1">Total Karma Balance</p>
                        <h1 className="text-5xl font-black tracking-tight flex items-baseline gap-2">
                            350 <span className="text-xl font-bold text-emerald-400">Pts</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-4 text-sm text-slate-300 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span>Silver Tier Member</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                            Earn More
                        </button>
                        <button className="px-5 py-2.5 bg-white/10 text-white rounded-xl font-bold text-sm backdrop-blur-md hover:bg-white/20 transition-colors">
                            Send Gift
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 px-2">
                <button 
                    onClick={() => setActiveTab('redeem')}
                    className={`pb-3 font-bold text-sm transition-colors relative ${activeTab === 'redeem' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
                >
                    Redeem Rewards
                    {activeTab === 'redeem' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 font-bold text-sm transition-colors relative ${activeTab === 'history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
                >
                    My Coupons
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'redeem' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map(r => {
                        const isLocked = r.cost > 350; // Hardcoded user points for demo
                        return (
                            <div key={r.id} className="group bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-none transition-all duration-300 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 ${r.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-50 dark:shadow-none`}>
                                        {r.icon}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                        {r.type}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{r.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Valid for 30 days from redemption.</p>
                                
                                <div className="mt-auto flex items-center justify-between">
                                    <div className={`font-black text-lg ${isLocked ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                        {r.cost} <span className="text-xs font-bold">Pts</span>
                                    </div>
                                    <button 
                                        disabled={isLocked}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                            isLocked 
                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center gap-1 cursor-not-allowed' 
                                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95'
                                        }`}
                                    >
                                        {isLocked ? <><Lock size={12} /> Need {r.cost - 350}</> : 'Redeem'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                                    <Ticket size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                    <p className="text-xs text-slate-500">Redeemed on {item.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 mb-1">
                                    {item.code}
                                </div>
                                <div className="text-[10px] text-emerald-500 font-bold">Active</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rewards;
