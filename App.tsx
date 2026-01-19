
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, CivicIssue } from './types';
import { ThemeProvider, LanguageProvider } from './contexts';
import { Layout } from './components/Layout';
import { ChatBot } from './components/ChatBot';
import LoginPage from './views/LoginPage';
import HomeGrid from './views/HomeGrid'; 
import SewageRequest from './views/SewageRequest'; 
import CitizenDashboard from './views/CitizenDashboard';
import AuthorityDashboard from './views/AuthorityDashboard';
import WorkerDashboard from './views/WorkerDashboard';
import ReportIssue from './views/ReportIssue';
import IssueDetails from './views/IssueDetails';
import Profile from './views/Profile';
import MyReports from './views/MyReports';
import Settings from './views/Settings';
import Rewards from './views/Rewards';
import Achievements from './views/Achievements';
import HelpSupport from './views/HelpSupport';
import EditProfile from './views/EditProfile'; // New Import
import { Briefcase, ClipboardList, Users } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<CivicIssue[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('myvoice_user');
    const savedIssues = localStorage.getItem('myvoice_issues');
    
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    } else {
      const mockIssues: CivicIssue[] = [
        {
          id: '1',
          title: 'Large Pothole on Main St',
          description: 'Deep pothole causing traffic issues near the signal.',
          category: 'Road Safety',
          status: 'PENDING',
          location: { lat: 19.076, lng: 72.877, address: 'Main Street, Mumbai' },
          image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
          reportedBy: 'user1',
          reportedAt: new Date().toISOString(),
          priority: 'HIGH',
          department: 'Public Works',
          upvotes: 12,
          comments: [
            { id: 'c1', userId: 'u2', userName: 'Citizen Jane', text: 'This is really dangerous for bikers.', timestamp: new Date().toISOString() }
          ]
        },
        {
          id: '2',
          title: 'Garbage pile near Park',
          description: 'Garbage hasn\'t been picked up for 3 days.',
          category: 'Waste Management',
          status: 'IN_PROGRESS',
          location: { lat: 19.080, lng: 72.880, address: 'Sunrise Park Road' },
          image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800',
          reportedBy: 'user2',
          reportedAt: new Date(Date.now() - 86400000).toISOString(),
          priority: 'MEDIUM',
          department: 'Municipal Corporation',
          upvotes: 5,
          comments: []
        },
        // Worker Specific Data
        {
          id: 'w1',
          title: 'Broken Street Light #42',
          description: 'Street light blinking and sparking intermittently.',
          category: 'Electricity',
          status: 'ASSIGNED',
          assignedTo: 'WORKER_01',
          location: { lat: 19.100, lng: 72.890, address: 'Sector 5, Market Road' },
          reportedBy: 'user3',
          reportedAt: new Date(Date.now() - 172800000).toISOString(),
          priority: 'MEDIUM',
          department: 'Electric Board',
          upvotes: 2,
          comments: []
        },
        {
          id: 'w2',
          title: 'Water Pipe Leakage',
          description: 'Major pipeline burst flooding the intersection.',
          category: 'Water Supply',
          status: 'IN_PROGRESS',
          assignedTo: 'WORKER_01',
          location: { lat: 19.110, lng: 72.900, address: 'Junction 9, MG Road' },
          reportedBy: 'user4',
          reportedAt: new Date(Date.now() - 3600000).toISOString(),
          priority: 'HIGH',
          department: 'Water Board',
          upvotes: 25,
          comments: []
        },
        {
          id: 'w3',
          title: 'Illegal Parking Blockade',
          description: 'Car parked in front of fire hydrant.',
          category: 'Traffic',
          status: 'RESOLVED',
          assignedTo: 'WORKER_01',
          location: { lat: 19.120, lng: 72.910, address: 'Civil Lines' },
          reportedBy: 'user5',
          reportedAt: new Date(Date.now() - 432000000).toISOString(),
          priority: 'MEDIUM',
          department: 'Traffic Police',
          upvotes: 8,
          comments: []
        }
      ];
      setIssues(mockIssues);
      localStorage.setItem('myvoice_issues', JSON.stringify(mockIssues));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('myvoice_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('myvoice_user');
  };

  const addIssue = (newIssue: CivicIssue) => {
    const updated = [newIssue, ...issues];
    setIssues(updated);
    localStorage.setItem('myvoice_issues', JSON.stringify(updated));
  };

  const updateIssue = (id: string, updates: Partial<CivicIssue>) => {
    const updated = issues.map(issue => issue.id === id ? { ...issue, ...updates } : issue);
    setIssues(updated);
    localStorage.setItem('myvoice_issues', JSON.stringify(updated));
  };

  // Simple placeholder components for new routes
  const PlaceholderPage = ({ title, icon: Icon, desc }: any) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 animate-in fade-in zoom-in-95">
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mb-6">
        <Icon size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">{desc}</p>
    </div>
  );

  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={
                !currentUser ? <LoginPage onLogin={handleLogin} /> : 
                currentUser.role === 'CITIZEN' ? <Navigate to="/home" /> : // Citizen Home is Grid
                <Navigate to="/dashboard" />
            } />
            
            <Route 
              path="/*" 
              element={
                currentUser ? (
                  <Layout user={currentUser} onLogout={handleLogout}>
                    <Routes>
                      {/* New Citizen Routes */}
                      <Route path="/home" element={<HomeGrid user={currentUser} />} />
                      <Route path="/sewage-request" element={<SewageRequest />} />

                      <Route path="/dashboard" element={
                        currentUser.role === 'CITIZEN' ? <CitizenDashboard issues={issues} /> :
                        currentUser.role === 'AUTHORITY' ? <AuthorityDashboard issues={issues} onUpdate={updateIssue} /> :
                        <WorkerDashboard issues={issues} onUpdate={updateIssue} userId={currentUser.id} />
                      } />
                      
                      <Route path="/issue/:id" element={<IssueDetails issues={issues} user={currentUser} onUpdate={updateIssue} />} />
                      <Route path="/report" element={<ReportIssue onAdd={addIssue} onUpdate={updateIssue} user={currentUser} existingIssues={issues} />} />
                      <Route path="/profile" element={<Profile user={currentUser} />} />
                      <Route path="/edit-profile" element={<EditProfile user={currentUser} />} />
                      <Route path="/my-reports" element={<MyReports issues={issues} user={currentUser} />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/rewards" element={<Rewards />} />
                      <Route path="/achievements" element={<Achievements />} />
                      <Route path="/help-support" element={<HelpSupport />} />
                      
                      <Route path="/analytics" element={<div className="text-center p-10 text-slate-500">Analytics Module Loading...</div>} />
                      
                      {/* Authority Routes */}
                      <Route path="/manage-staff" element={<PlaceholderPage title="Staff Management" icon={Users} desc="Manage departmental permissions, shifts, and team assignments here." />} />
                      <Route path="/reports-log" element={<PlaceholderPage title="Reports Registry" icon={ClipboardList} desc="Full historical log of all civic issues and their resolution trails." />} />

                      {/* Worker Routes */}
                      <Route path="/work-history" element={<PlaceholderPage title="Work History" icon={Briefcase} desc="Your past completed tasks and performance metrics." />} />
                      
                      <Route path="*" element={<Navigate to="/home" />} />
                    </Routes>
                    <ChatBot />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
          </Routes>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
