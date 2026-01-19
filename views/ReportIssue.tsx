
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CivicIssue, User } from '../types';
import { analyzeIssue } from '../services/geminiService';
import { useLanguage } from '../contexts';
import { 
  Camera, MapPin, Send, Loader2, X, Sparkles, ArrowLeft, Mic, AlertOctagon,
  Image as ImageIcon, StopCircle, Navigation, Zap, ZapOff, RefreshCw, Trash2, Play, Pause
} from 'lucide-react';

interface Props {
  onAdd: (issue: CivicIssue) => void;
  onUpdate: (id: string, updates: Partial<CivicIssue>) => void;
  user: User;
  existingIssues: CivicIssue[];
}

const ReportIssue: React.FC<Props> = ({ onAdd, user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();
  
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  // Camera State
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashOn, setFlashOn] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isValidIssue, setIsValidIssue] = useState<boolean | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isMapAdjusting, setIsMapAdjusting] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Camera
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
        // Stop any existing stream first
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }

        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const constraints: MediaStreamConstraints = {
                    video: { 
                        facingMode: facingMode,
                        // @ts-ignore - advanced constraints for flash
                        advanced: [{ torch: flashOn }] 
                    },
                    audio: false
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                
                if (mounted) {
                    setCameraStream(stream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setCameraError(false);
                    
                    // Apply flash if possible
                    const track = stream.getVideoTracks()[0];
                    if (track) {
                        try {
                            // @ts-ignore
                            await track.applyConstraints({ advanced: [{ torch: flashOn }] });
                        } catch (e) {
                            // Flash might not be supported, ignore error
                        }
                    }
                }
            } else {
                if (mounted) setCameraError(true);
            }
        } catch (err) {
            console.error("Camera access error:", err);
            if (mounted) setCameraError(true);
        }
    };

    if (!image) {
        startCamera();
        setAiAnalysis(null);
        setIsValidIssue(null);
        setLocation(null);
        setDescription('');
        setAudioUrl(null);
    } else {
        stopCamera();
    }
    
    return () => {
        mounted = false;
        stopCamera();
    };
  }, [image, facingMode, flashOn]);

  const toggleCameraFlip = () => {
      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleFlash = () => {
      setFlashOn(prev => !prev);
  };

  // Audio Recording Functions
  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            
            // Clean up stream
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        
        timerIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access is required to record audio.");
    }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
          }
      }
  };

  const deleteRecording = () => {
      setAudioUrl(null);
      setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Processing logic when Image is Captured
  useEffect(() => {
    if (!image) return;
    const processImage = async () => {
        setIsProcessing(true);
        setIsValidIssue(null);
        
        const locPromise = new Promise<{ lat: number; lng: number; address: string }>((resolve) => {
             if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    setTimeout(() => {
                        resolve({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                            address: "24-B Green View Colony, Ward 12"
                        });
                    }, 1500);
                }, () => resolve({ lat: 19.076, lng: 72.877, address: "Location Unavailable" }));
             } else {
                 resolve({ lat: 19.076, lng: 72.877, address: "Location Not Supported" });
             }
        });

        const aiPromise = analyzeIssue("", image);

        try {
            const [locResult, aiResult] = await Promise.all([locPromise, aiPromise]);
            setLocation(locResult);
            if (aiResult.isCivicIssue === false) {
                setIsValidIssue(false);
                setRejectionReason(aiResult.rejectionReason || "Image does not look like a civic issue.");
            } else {
                setIsValidIssue(true);
                setAiAnalysis(aiResult);
            }
        } catch (e) {
            setIsValidIssue(true);
            setLocation({ lat: 19.076, lng: 72.877, address: "Unknown Location" });
        } finally {
            setIsProcessing(false);
        }
    };
    processImage();
  }, [image]);

  const stopCamera = () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
    }
  };

  const handleCapture = () => {
      if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
              // Mirror the context if using front camera so the saved image matches preview
              if (facingMode === 'user') {
                  ctx.translate(canvas.width, 0);
                  ctx.scale(-1, 1);
              }
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              setImage(canvas.toDataURL('image/jpeg', 0.8));
          }
      } else {
          fileInputRef.current?.click();
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return; 

    const newIssue: CivicIssue = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      title: aiAnalysis?.summary || aiAnalysis?.category || 'Reported Issue',
      description: description || "No description provided.",
      category: aiAnalysis?.category || 'Uncategorized',
      status: 'PENDING',
      location: location!,
      image: image || undefined,
      reportedBy: user.id,
      reportedAt: new Date().toISOString(),
      priority: aiAnalysis?.priority || 'MEDIUM',
      department: aiAnalysis?.department || 'General',
      upvotes: 0,
      comments: []
    };
    onAdd(newIssue);
    navigate('/dashboard'); 
  };

  const retakePhoto = () => setImage(null);

  // --- RENDER ---

  // CAMERA MODE
  if (!image) {
      return (
          <div className="fixed inset-0 z-50 bg-black flex flex-col">
              <canvas ref={canvasRef} className="hidden" />
              {!cameraError ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
                  />
              ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 space-y-4">
                      <Camera size={48} />
                      <p>Camera access unavailable</p>
                  </div>
              )}
              
              {/* Top Controls */}
              <div className="w-full p-6 flex justify-between items-center text-white z-10 relative bg-gradient-to-b from-black/60 to-transparent">
                  <button onClick={() => navigate(-1)} className="p-3 bg-black/20 rounded-full backdrop-blur-md hover:bg-black/40">
                      <ArrowLeft size={24} />
                  </button>
                  <div className="flex gap-4">
                      <button onClick={toggleFlash} className={`p-3 rounded-full backdrop-blur-md transition-colors ${flashOn ? 'bg-yellow-400/80 text-black' : 'bg-black/20 text-white'}`}>
                          {flashOn ? <Zap size={24} fill="currentColor" /> : <ZapOff size={24} />}
                      </button>
                      <button onClick={toggleCameraFlip} className="p-3 bg-black/20 rounded-full backdrop-blur-md hover:bg-black/40">
                          <RefreshCw size={24} />
                      </button>
                  </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-10">
                  <button onClick={() => fileInputRef.current?.click()} className="p-4 rounded-2xl bg-white/10 text-white backdrop-blur-md hover:bg-white/20">
                      <ImageIcon size={24} />
                  </button>
                  <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full border-[6px] border-indigo-500/50 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                      <div className="w-16 h-16 bg-white rounded-full border-2 border-black/10"></div>
                  </button>
                  <div className="w-12"></div> {/* Spacer for alignment */}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
      );
  }

  // INVALID ISSUE
  if (!isProcessing && isValidIssue === false) {
      return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 animate-in fade-in">
             <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertOctagon size={48} className="text-red-500" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Issue Not Detected</h2>
             <p className="text-slate-400 mb-8 text-center max-w-xs">{rejectionReason}</p>
             <button onClick={retakePhoto} className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                Try Again
             </button>
        </div>
      )
  }

  // FORM MODE
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col animate-in fade-in duration-300 overflow-y-auto">
      
      {/* 1. Header with Image */}
      <div className="relative h-64 w-full shrink-0">
          <img src={image} className="w-full h-full object-cover" alt="Capture" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
          
          <button onClick={retakePhoto} className="absolute top-4 left-4 p-2 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-colors">
              <X size={20} />
          </button>
      </div>

      {/* 2. Processing State */}
      {isProcessing ? (
        <div className="flex-1 flex flex-col items-center justify-start pt-10 px-6">
            <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('analyzing_image')}</h3>
            <p className="text-slate-500 text-sm text-center">Detecting issue type and fetching location...</p>
        </div>
      ) : (
        /* 3. Main Form */
        <div className="flex-1 px-6 pb-8 -mt-6 relative z-10">
           
           {/* AI Badge */}
           {aiAnalysis && (
               <div className="flex justify-center mb-6">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-full text-sm font-bold text-indigo-600 dark:text-indigo-400">
                       <Sparkles size={16} /> {aiAnalysis.category} • {aiAnalysis.priority}
                   </div>
               </div>
           )}

           <div className="space-y-6">
               {/* Location Map Preview */}
               <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 group">
                      {/* Fake Map Background */}
                      <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin size={32} className={`text-red-500 drop-shadow-md transition-transform ${isMapAdjusting ? '-translate-y-2' : ''}`} fill="currentColor" />
                      </div>
                      
                      {/* Interaction Overlay */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors cursor-pointer" onClick={() => setIsMapAdjusting(!isMapAdjusting)}></div>
                      
                      {isMapAdjusting && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md">
                              Drag to adjust
                          </div>
                      )}
                  </div>
                  <div className="px-2 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Navigation size={16} className="text-indigo-500" />
                          <span className="text-sm font-bold truncate max-w-[200px]">{location?.address}</span>
                      </div>
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Change</button>
                  </div>
               </div>

               {/* Description & Audio */}
               <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
                       {t('description')} <span className="text-slate-300 font-normal normal-case">(Optional)</span>
                   </label>
                   
                   <div className="relative group">
                       <textarea 
                           rows={3}
                           placeholder="Type details..."
                           className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 text-base text-slate-900 dark:text-white font-medium resize-none focus:outline-none transition-all placeholder:text-slate-400"
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                       />
                   </div>

                   <div className="mt-3">
                       {audioUrl ? (
                           <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                               <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                   <Play size={20} fill="currentColor" />
                               </div>
                               <div className="flex-1 min-w-0">
                                   <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Audio Note</div>
                                   <audio src={audioUrl} controls className="h-6 w-full max-w-[200px]" />
                               </div>
                               <button 
                                   onClick={deleteRecording}
                                   className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                               >
                                   <Trash2 size={18} />
                               </button>
                           </div>
                       ) : (
                           <button 
                               onClick={isRecording ? stopRecording : startRecording}
                               className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                                   isRecording 
                                   ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' 
                                   : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500'
                               }`}
                           >
                               {isRecording ? (
                                   <><StopCircle size={18} /> Stop Recording ({formatTime(recordingTime)})</>
                               ) : (
                                   <><Mic size={18} /> Record Audio Note</>
                               )}
                           </button>
                       )}
                   </div>
               </div>

               <button 
                   onClick={handleSubmit}
                   className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-[1.02] active:scale-95"
               >
                   <Send size={22} /> {t('submit')}
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;
