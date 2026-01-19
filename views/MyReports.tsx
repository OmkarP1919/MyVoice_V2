
import React, { useState } from 'react';
import { CivicIssue, User } from '../types';
import { useLanguage } from '../contexts';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, MapPin, ChevronRight, Search, Filter, Calendar, X } from 'lucide-react';

interface Props {
  issues: CivicIssue[];
  user: User;
}

const MyReports: React.FC<Props> = ({ issues, user }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const myIssues = issues.filter(i => i.reportedBy === user.id);

  const filteredIssues = myIssues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
      return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'RESOLVED': return 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none';
        case 'IN_PROGRESS': return 'bg-orange-500 text-white shadow-orange-200 dark:shadow-none';
        case 'REJECTED': return 'bg-red-500 text-white shadow-red-200 dark:shadow-none';
        case 'ASSIGNED': return 'bg-blue-500 text-white shadow-blue-200 dark:shadow-none';
        default: return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500" onClick={() => showFilterMenu && setShowFilterMenu(false)}>
      
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('my_reports')}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your civic contributions</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center font-black text-xl">
                {myIssues.length}
            </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2 relative z-20">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder={t('search')} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm" 
                />
            </div>
            <div className="relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowFilterMenu(!showFilterMenu); }}
                    className={`p-3 border rounded-2xl shadow-sm transition-colors ${
                        statusFilter !== 'ALL' || showFilterMenu
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600'
                    }`}
                >
                    <Filter size={20} />
                </button>
                
                {/* Filter Dropdown */}
                {showFilterMenu && (
                    <div className="absolute right-0 top-14 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 animate-in zoom-in-95 origin-top-right">
                        <div className="text-xs font-bold text-slate-400 uppercase px-3 py-2">Filter by Status</div>
                        {['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between ${
                                    statusFilter === status 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {status.replace('_', ' ')}
                                {statusFilter === status && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Active Filter Badge */}
      {statusFilter !== 'ALL' && (
          <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filtering by:</span>
              <button 
                onClick={() => setStatusFilter('ALL')}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold"
              >
                  {statusFilter.replace('_', ' ')} <X size={12} />
              </button>
          </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIssues.length > 0 ? filteredIssues.map(issue => (
          <Link 
            to={`/issue/${issue.id}`} 
            key={issue.id} 
            className="group bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col gap-4"
          >
            {/* Image & Status Badge */}
            <div className="relative w-full h-48 rounded-3xl overflow-hidden">
                {issue.image ? (
                    <img src={issue.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" alt="Evidence" />
                ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <AlertCircle size={32} />
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${getStatusStyle(issue.status)}`}>
                        {issue.status.replace('_', ' ')}
                    </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
                        <Calendar size={12} />
                        <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="px-2 pb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {issue.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {issue.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <MapPin size={14} className="text-indigo-500" />
                        <span className="truncate max-w-[150px]">{issue.location.address.split(',')[0]}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>
          </Link>
        )) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-500 mb-6 animate-bounce">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {searchTerm || statusFilter !== 'ALL' ? 'No matches found' : t('report_new') + '?'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
                {searchTerm || statusFilter !== 'ALL' 
                 ? "Try adjusting your filters or search terms." 
                 : "You haven't submitted any reports yet. Help improve your city today!"}
            </p>
            {(searchTerm || statusFilter !== 'ALL') ? (
                <button onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }} className="text-indigo-600 font-bold hover:underline">
                    Clear Filters
                </button>
            ) : (
                <Link to="/report" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all">
                    Start Reporting
                </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
