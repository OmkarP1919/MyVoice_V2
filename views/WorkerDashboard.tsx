
import React from 'react';
import { CivicIssue } from '../types';
import { useLanguage } from '../contexts';
import { MapPin, CheckCircle, Navigation, MessageSquare } from 'lucide-react';

interface Props {
  issues: CivicIssue[];
  onUpdate: (id: string, updates: Partial<CivicIssue>) => void;
  userId: string;
}

const WorkerDashboard: React.FC<Props> = ({ issues, onUpdate, userId }) => {
  const { t } = useLanguage();
  const myTasks = issues.filter(i => i.assignedTo === 'WORKER_01' || i.assignedTo === userId);
  const pendingTasks = myTasks.filter(i => i.status !== 'RESOLVED');
  const completedTasks = myTasks.filter(i => i.status === 'RESOLVED');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('task_list')}</h1>
        <p className="text-slate-500 dark:text-slate-400">View and update your assigned resolution tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            Active Tasks <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs px-2 py-0.5 rounded-full">{pendingTasks.length}</span>
          </h2>
          <div className="space-y-4">
            {pendingTasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-600">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{task.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{task.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-widest ${
                    task.priority === 'HIGH' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-6 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                  <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="truncate font-medium">{task.location.address}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Navigation size={18} />
                    <span className="text-[10px] font-bold uppercase">Route</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-[10px] font-bold uppercase">Status</span>
                  </button>
                  <button 
                    onClick={() => onUpdate(task.id, { status: 'RESOLVED' })}
                    className="flex flex-col items-center gap-1 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                  >
                    <CheckCircle size={18} />
                    <span className="text-[10px] font-bold uppercase">Done</span>
                  </button>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                All caught up! No active tasks.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4 opacity-75">
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            Recently Resolved <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full">{completedTasks.length}</span>
          </h2>
          <div className="space-y-4">
            {completedTasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{task.title}</h4>
                  <p className="text-xs text-slate-400">Resolved on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-emerald-500 dark:text-emerald-400 font-bold text-xs">+50 Pts</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkerDashboard;
