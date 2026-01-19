
import React, { useState } from 'react';
import { CivicIssue, IssueStatus } from '../types';
import { useLanguage } from '../contexts';
import { 
  Filter, 
  Search, 
  MoreVertical, 
  UserPlus, 
  Layers,
  BarChart,
  PieChart
} from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  issues: CivicIssue[];
  onUpdate: (id: string, updates: Partial<CivicIssue>) => void;
}

const AuthorityDashboard: React.FC<Props> = ({ issues, onUpdate }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<IssueStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = issues.filter(i => 
    (filter === 'ALL' || i.status === filter) &&
    (i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.includes(searchTerm))
  );

  const chartData = [
    { name: 'Roads', count: issues.filter(i => i.category.includes('Road')).length },
    { name: 'Waste', count: issues.filter(i => i.category.includes('Waste')).length },
    { name: 'Water', count: issues.filter(i => i.category.includes('Water')).length },
    { name: 'Electric', count: issues.filter(i => i.category.includes('Electricity')).length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('admin_command')}</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor and route civic issues across all departments.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-500 hover:text-indigo-600 transition-colors">
             <Layers size={20} />
           </button>
           <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-500 hover:text-indigo-600 transition-colors">
             <BarChart size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={t('search') + "..."}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">{t('status_pending')}</option>
                  <option value="ASSIGNED">{t('status_assigned')}</option>
                  <option value="IN_PROGRESS">{t('status_inprogress')}</option>
                  <option value="RESOLVED">{t('status_resolved')}</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm font-semibold border-b border-slate-50 dark:border-slate-800">
                    <th className="pb-4 pl-2">Issue Details</th>
                    <th className="pb-4">{t('category')}</th>
                    <th className="pb-4">{t('priority')}</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredIssues.map(issue => (
                    <tr key={issue.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="py-4 pl-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{issue.title}</span>
                          <span className="text-xs text-slate-400 font-mono">#{issue.id}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{issue.category}</span>
                      </td>
                      <td className="py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          issue.priority === 'HIGH' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                          issue.priority === 'MEDIUM' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            issue.status === 'PENDING' ? 'bg-slate-400' :
                            issue.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}></div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{issue.status}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {issue.status === 'PENDING' && (
                            <button 
                              onClick={() => onUpdate(issue.id, { status: 'ASSIGNED', assignedTo: 'WORKER_01' })}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                              title="Assign Worker"
                            >
                              <UserPlus size={18} />
                            </button>
                          )}
                          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredIssues.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  No issues found matching your filters.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Issues by Category</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
            <h3 className="text-lg font-bold mb-2">{t('efficiency')}</h3>
            <p className="text-indigo-100 text-sm mb-6">Resolution rate has improved by 14% this week following the new routing protocol.</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-2xl font-black">82%</div>
                <div className="text-[10px] uppercase tracking-wider text-indigo-200 font-bold">Solved within 24h</div>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div className="flex-1">
                <div className="text-2xl font-black">4.8</div>
                <div className="text-[10px] uppercase tracking-wider text-indigo-200 font-bold">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
