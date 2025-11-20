import React, { useState } from 'react';
import Landing from './pages/Landing';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSessionPage from './pages/InterviewSession';
import ReportPage from './pages/Report';
import Dashboard from './pages/admin/Dashboard';
import Questions from './pages/admin/Questions';
import Users from './pages/admin/Users';
import Interviews from './pages/admin/Interviews';
import Settings from './pages/admin/Settings';
import AdminLoginPage from './pages/admin/Login';
import { Navbar, AdminSidebar } from './components/Layout';

const App: React.FC = () => {
  const [page, setPage] = useState('landing');
  const [interviewData, setInterviewData] = useState<any>(null);
  const [completedSessionId, setCompletedSessionId] = useState<string>('');

  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('parakeet_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const navigate = (p: string) => {
    window.scrollTo(0,0);
    // If trying to access admin area while logged out, redirect to login
    if (p.startsWith('admin-') && !isAdminAuthenticated) {
      setPage('admin-login');
    } else {
      setPage(p);
    }
  };
  
  const handleAdminLogin = () => {
    localStorage.setItem('parakeet_admin_auth', 'true');
    setIsAdminAuthenticated(true);
    navigate('admin-dashboard');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('parakeet_admin_auth');
    setIsAdminAuthenticated(false);
    navigate('landing');
  };

  const startInterview = (data: any) => {
    setInterviewData(data);
    navigate('session');
  };

  const finishInterview = (id: string) => {
    setCompletedSessionId(id);
    navigate('report');
  };

  const viewReport = (id: string) => {
    setCompletedSessionId(id);
    navigate('report');
  }

  // Admin Login Route
  if (page === 'admin-login') {
    return <AdminLoginPage onLoginSuccess={handleAdminLogin} onNavigate={navigate} />;
  }

  // Protected Admin Routes
  if (page.startsWith('admin')) {
    // This is a fallback/security check. The `navigate` function should prevent this.
    if (!isAdminAuthenticated) {
       return <AdminLoginPage onLoginSuccess={handleAdminLogin} onNavigate={navigate} />;
    }
    return (
        <div className="flex min-h-screen bg-background font-sans">
            <AdminSidebar currentPage={page} onNavigate={navigate} onLogout={handleAdminLogout} />
            <div className="flex-1">
                {page === 'admin-dashboard' && <Dashboard />}
                {page === 'admin-questions' && <Questions />}
                {page === 'admin-users' && <Users />}
                {page === 'admin-interviews' && <Interviews onViewReport={viewReport} />}
                {page === 'admin-settings' && <Settings />}
            </div>
        </div>
    );
  }

  // Public Routes
  return (
    <div className="font-sans text-slate-800">
      {page !== 'session' && <Navbar onNavigate={navigate} />}
      
      {page === 'landing' && <Landing onStart={() => navigate('setup')} />}
      
      {page === 'setup' && (
        <InterviewSetup 
            onStart={startInterview} 
            onBack={() => navigate('landing')} 
        />
      )}
      
      {page === 'session' && interviewData && (
        <InterviewSessionPage 
            setupData={interviewData} 
            onFinish={finishInterview} 
        />
      )}

      {page === 'report' && (
        <ReportPage 
            sessionId={completedSessionId} 
            onHome={() => navigate('landing')} 
        />
      )}
    </div>
  );
};

export default App;
