import React, { useState } from 'react';
import { Mic, LayoutDashboard, Settings, FileText, Users, LogOut } from 'lucide-react';

export const Navbar: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="bg-primary/10 p-2 rounded-lg">
            <Mic className="h-6 w-6 text-primary" />
          </div>
          <span className="ml-2 text-xl font-bold text-secondary">Parakeet<span className="text-primary">.ai</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate('admin-dashboard')} className="text-gray-500 hover:text-primary font-medium text-sm">
            Admin Demo
          </button>
          <button 
            onClick={() => onNavigate('setup')}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export const AdminSidebar: React.FC<{ currentPage: string, onNavigate: (page: string) => void, onLogout: () => void }> = ({ currentPage, onNavigate, onLogout }) => {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const items = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-questions', label: 'Questions', icon: FileText },
    { id: 'admin-users', label: 'Candidates', icon: Users },
    { id: 'admin-interviews', label: 'Interviews', icon: Mic },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];
  
  const handleConfirmLogout = () => {
    onLogout();
    setIsLogoutConfirmOpen(false);
  };

  return (
    <>
      <div className="w-64 bg-secondary text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl">
        <div className="p-6 flex items-center border-b border-gray-700">
           <Mic className="h-6 w-6 text-accent" />
           <span className="ml-3 text-xl font-bold">Admin Panel</span>
        </div>
        <div className="flex-1 py-6 px-3 space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                currentPage === item.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700">
          <button onClick={() => setIsLogoutConfirmOpen(true)} className="flex items-center text-gray-400 hover:text-white w-full px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-secondary shadow-xl">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setIsLogoutConfirmOpen(false)} 
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout} 
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
