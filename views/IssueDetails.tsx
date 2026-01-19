
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CivicIssue, User } from '../types';
import { 
  ArrowLeft, MapPin, Clock, ThumbsUp, MessageSquare, 
  Share2, CheckCircle2, AlertCircle, Send, Truck, Phone, Copy, Loader2, GitMerge
} from 'lucide-react';
import { useLanguage } from '../contexts';
import { checkDuplicateIssue } from '../services/geminiService';

interface Props {
  issues: CivicIssue[];
  user: User;
  onUpdate: (id: string, updates: Partial<CivicIssue>) => void;
}

const IssueDetails: React.FC<Props> = ({ issues, user, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const issue = issues.find(i => i.id === id);
  const [newComment, setNewComment] = useState('');
  
  // Duplicate Check States
  const [isCheckingDup, setIsCheckingDup] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<CivicIssue | null>(null);
  const [showDupModal, setShowDupModal] = useState(false);

  if (!issue) return <div className="text-center py-20">Issue not found</div>;

  const handleUpvote = () => {
    onUpdate(issue.id, { upvotes: (issue.upvotes || 0) + 1 });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      text: newComment,
      timestamp: new Date().toISOString()
    };
    onUpdate(issue.id, { comments: [...(issue.comments || []), comment] });
    setNewComment('');
  };

  // Helper to convert URL to Base64 (needed for AI service if images are URLs)
  const toBase64 = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      // If it's already data url
      if (url.startsWith('data:')) {
        resolve(url);
        return;
      }
      
      // For demo purposes, if it's a remote URL, we might face CORS.
      // We will try fetch. If fail, we assume it's not checkable in this demo environment
      // unless we proxy. For the "User Uploaded" images (base64) it works fine.
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        })
        .catch(() => resolve('')); // Fail gracefully
    });
  };

  const handleReportDuplicate = async () => {
    if (!issue.image) {
        alert("This issue has no image to compare.");
        return;
    }

    setIsCheckingDup(true);
    
    let found: CivicIssue | null = null;
    
    try {
        const currentImgBase64 = await toBase64(issue.image);
        if (!currentImgBase64) {
             // Fallback for demo if CORS blocks unsplash
             setIsCheckingDup(false);
             alert("Cannot verify image due to browser security restrictions on external images.");
             return;
        }

        // Check against other issues
        for (const other of issues) {
            if (other.id === issue.id) continue;
            if (!other.image) continue;
            if (other.status === 'RESOLVED' || other.status === 'REJECTED') continue;

            const otherImgBase64 = await toBase64(other.image);
            if (!otherImgBase64) continue;

            const result = await checkDuplicateIssue(currentImgBase64, otherImgBase64);
            if (result.isDuplicate) {
                found = other;
                break;
            }
        }
    } catch (e) {
        console.error(e);
    }

    setIsCheckingDup(false);

    if (found) {
        setDuplicateResult(found);
        setShowDupModal(true);
    } else {
        alert(t('no_duplicates'));
    }
  };

  const confirmMerge = () => {
    if (duplicateResult) {
        // Mark current as rejected (duplicate)
        onUpdate(issue.id, { status: 'REJECTED' });
        // Upvote original
        onUpdate(duplicateResult.id, { upvotes: (duplicateResult.upvotes || 0) + 1 });
        setShowDupModal(false);
        navigate(`/issue/${duplicateResult.id}`);
    }
  };

  const statusSteps = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
  const currentStepIndex = statusSteps.indexOf(issue.status) === -1 ? 0 : statusSteps.indexOf(issue.status);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Issue #{issue.id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Tracking Map (Only if In Progress or Assigned) */}
          {(issue.status === 'IN_PROGRESS' || issue.status === 'ASSIGNED') && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg relative h-72 group">
                {/* Realistic Map Background using a map-like image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-110 opacity-90"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')" }}
                ></div>
                
                {/* Overlay Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-slate-900/10"></div>

                {/* SVG Route Visualization */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Background Path for contrast */}
                    <path 
                        d="M 50,180 C 150,180 200,100 400,140 S 700,180 800,120" 
                        fill="none" 
                        stroke="rgba(0,0,0,0.5)" 
                        strokeWidth="8" 
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Animated Route Path */}
                    <path 
                        d="M 50,180 C 150,180 200,100 400,140 S 700,180 800,120" 
                        fill="none" 
                        stroke="#6366f1" 
                        strokeWidth="4"
                        strokeDasharray="12 8" 
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="animate-[dash_1s_linear_infinite]"
                        filter="url(#glow)"
                    >
                         <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                    </path>
                </svg>

                {/* Map Status Badge */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-md z-10 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">{t('live_tracking')}</span>
                </div>

                {/* Truck on Map (Positioned using percentage to match approx path middle) */}
                <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative group/truck">
                         <div className="bg-indigo-600 p-2.5 rounded-xl shadow-xl shadow-indigo-600/40 text-white transform -rotate-3 transition-transform group-hover/truck:scale-110">
                             <Truck size={22} fill="currentColor" />
                         </div>
                         {/* Pulse effect under truck */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-500/30 rounded-full animate-ping -z-10"></div>
                         
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-800 whitespace-nowrap opacity-0 group-hover/truck:opacity-100 transition-opacity">
                            Vehicle #TR-402
                         </div>
                    </div>
                </div>

                {/* Destination Pin (Positioned at approx path end) */}
                <div className="absolute top-[42%] right-[15%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <div className="relative">
                        <MapPin size={36} className="text-red-500 drop-shadow-lg" fill="currentColor" />
                        <div className="absolute top-[14px] left-[18px] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                    <div className="bg-black/50 text-white px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm mt-1">
                        Issue Location
                    </div>
                </div>

                {/* Driver Info Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between z-30">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                                <img src="https://i.pravatar.cc/150?u=driver" className="w-full h-full rounded-full object-cover" alt="driver" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('driver_nearby')}</p>
                            <p className="font-bold text-slate-900 dark:text-white text-base">Rajesh Kumar</p>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full w-fit mt-0.5">
                                <Phone size={10} fill="currentColor" /> <span>Contact Driver</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right pl-4 border-l border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('eta')}</p>
                        <p className="font-black text-indigo-600 text-2xl leading-none">12<span className="text-sm font-bold ml-0.5 text-slate-500">min</span></p>
                    </div>
                </div>
            </div>
          )}

          {/* Issue Image & Description */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
            {issue.image && <img src={issue.image} alt={issue.title} className="w-full h-80 object-cover" />}
            <div className="p-6">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{issue.title}</h2>
               <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{issue.description}</p>
               <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-500">
                 <span className="flex items-center gap-2"><Clock size={16} /> {new Date(issue.reportedAt).toLocaleDateString()}</span>
                 <span className="flex items-center gap-2"><MapPin size={16} /> {issue.location.address}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold text-slate-900 dark:text-white mb-6">Timeline</h3>
             <div className="space-y-6 relative pl-3">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  return (
                    <div key={step} className="relative z-10 flex items-center gap-4">
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                         isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-300 text-transparent'
                       }`}>
                         {isCompleted && <CheckCircle2 size={14} />}
                       </div>
                       <p className={`text-sm font-bold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                           {step.replace('_', ' ')}
                       </p>
                    </div>
                  )
                })}
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
                <button onClick={handleUpvote} className="flex flex-col items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl hover:bg-indigo-100 transition-colors">
                    <ThumbsUp size={24} className="text-indigo-600 mb-2" />
                    <span className="font-bold text-2xl dark:text-white">{issue.upvotes}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">Upvotes</span>
                </button>
                <button 
                    onClick={handleReportDuplicate}
                    disabled={isCheckingDup || issue.status === 'REJECTED'}
                    className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                    {isCheckingDup ? (
                        <Loader2 size={24} className="animate-spin text-slate-400 mb-2" />
                    ) : (
                        <Copy size={24} className="text-slate-600 dark:text-slate-400 mb-2" />
                    )}
                    <span className="font-bold text-sm dark:text-white mt-1 text-center leading-tight">
                        {isCheckingDup ? 'Checking...' : t('report_duplicate')}
                    </span>
                </button>
            </div>
             <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 transition-colors text-slate-600 dark:text-slate-300 font-bold text-sm">
                 <Share2 size={18} />
                 <span>Share Issue</span>
             </button>
          </div>
        </div>
      </div>

      {/* Duplicate Found Modal */}
      {showDupModal && duplicateResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-full flex items-center justify-center mb-4">
                        <GitMerge size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('duplicate_found')}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t('found_duplicate_desc')}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-6 flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                        {duplicateResult.image && <img src={duplicateResult.image} className="w-full h-full object-cover" alt="Original" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Original Issue</span>
                            <span className="text-xs text-slate-400">#{duplicateResult.id}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{duplicateResult.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2">{duplicateResult.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setShowDupModal(false)}
                        className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmMerge}
                        className="py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        {t('confirm_merge')}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetails;
