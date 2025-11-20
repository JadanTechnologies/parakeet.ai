import React, { useState } from 'react';
import { Mic, Key, LogIn } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
  onNavigate: (page: string) => void;
}

const AdminLoginPage: React.FC<Props> = ({ onLoginSuccess, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demo purposes
    if (username === 'admin' && password === 'password') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-8">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Mic className="h-8 w-8 text-primary" />
            </div>
            <span className="ml-3 text-3xl font-bold text-secondary">Parakeet<span className="text-primary">.ai</span></span>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-secondary mb-2">Admin Login</h2>
          <p className="text-center text-gray-500 mb-6">Enter your administrator credentials.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="password"
                />
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-transform transform hover:-translate-y-1 flex items-center justify-center"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </button>
          </form>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Not an admin?{' '}
          <button onClick={() => onNavigate('landing')} className="font-medium text-primary hover:underline">
            Go back to the main site.
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
