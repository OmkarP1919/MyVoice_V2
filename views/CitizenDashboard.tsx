
import React, { useState } from 'react';
import { CivicIssue } from '../types';
import { MapPin, Heart, MessageCircle, Filter, Search, MoreVertical, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts';

interface Props {
  issues: CivicIssue[];
}

const CitizenDashboard: React.FC<Props> = ({ issues }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'recent'>('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter Logic
  const categories = ['All', ...Array.from(new Set(issues.map(i => i.category)))];

  const filteredIssues = issues
    .filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
        return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
        if (sortBy === 'trending') return b.upvotes - a.upvotes;
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pb-2 pt-1">
          <div className="flex items-center justify-between px-2 mb-4">
             <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t('community_feed')}</h1>
          </div>

          <div className="flex flex-col gap-3 px-1">
              {/* Search Bar */}
              <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                      type="text" 
                      placeholder={t('search') + " issues..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm"
                  />
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${showFilters ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-100 text-slate-400'}`}
                  >
                      <SlidersHorizontal size={18} />
                  </button>
              </div>

              {/* Filters & Sorting */}
              {showFilters && (
                  <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2">
                      <select 
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 focus:outline-none"
                      >
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                  </div>
              )}

              {/* Sort Tabs */}
              <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-fit">
                  <button 
                    onClick={() => setSortBy('trending')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'trending' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Trending
                  </button>
                  <button 
                    onClick={() => setSortBy('recent')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'recent' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Recent
                  </button>
              </div>
          </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4 px-1">
        {filteredIssues.length > 0 ? filteredIssues.map(issue => (
          <FeedCard key={issue.id} issue={issue} />
        )) : (
           <div className="text-center py-20 text-slate-400">
              <p>No issues found matching your criteria.</p>
           </div>
        )}
      </div>
    </div>
  );
};

const FeedCard: React.FC<{ issue: CivicIssue }> = ({ issue }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4">
      
      {/* Compact Image */}
      <Link to={`/issue/${issue.id}`} className="shrink-0 w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative group">
         {issue.image ? (
            <img src={issue.image} alt={issue.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
                <MapPin size={20} />
            </div>
         )}
         <div className="absolute top-1 left-1">
             <div className={`w-2 h-2 rounded-full ${
                issue.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-orange-500'
             }`}></div>
         </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
         <div>
             <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 leading-tight mb-1">{issue.title}</h3>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{new Date(issue.reportedAt).toLocaleDateString(undefined, {month: 'short', day:'numeric'})}</span>
             </div>
             
             <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                 {issue.description}
             </p>
             
             <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                 <MapPin size={10} className="text-indigo-500" />
                 <span className="truncate max-w-[150px]">{issue.location.address.split(',')[0]}</span>
             </div>
         </div>

         {/* Actions Footer */}
         <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800 mt-2">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-slate-500">
                    <Heart size={14} className={issue.upvotes > 10 ? "fill-red-500 text-red-500" : ""} />
                    <span className="text-xs font-bold">{issue.upvotes}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                    <MessageCircle size={14} />
                    <span className="text-xs font-bold">{issue.comments?.length || 0}</span>
                </div>
             </div>
             <Link to={`/issue/${issue.id}`} className="text-indigo-600 dark:text-indigo-400">
                 <ArrowUpRight size={16} />
             </Link>
         </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
