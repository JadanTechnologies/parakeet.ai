import React, { useState } from 'react';
import { Bell, Key, Palette } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    theme: 'light',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({...prev, [key]: !prev[key]}));
  };
  
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen ml-64">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Settings</h1>
        <p className="text-gray-500">Manage your application settings.</p>
      </div>

      <div className="max-w-2xl space-y-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-secondary flex items-center gap-2 mb-4"><Bell size={20} /> Notifications</h3>
          <div className="flex justify-between items-center">
            <p>Email notifications for completed interviews</p>
            <button onClick={() => handleToggle('notifications')} className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${settings.notifications ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${settings.notifications ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-secondary flex items-center gap-2 mb-4"><Key size={20} /> API Configuration</h3>
          <div>
            <label className="text-sm font-medium text-gray-700">Gemini API Key</label>
            <div className="mt-1 flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
              <input type="text" readOnly value={`********************${process.env.API_KEY?.slice(-4) || 'DEMO'}`} className="bg-transparent outline-none w-full" />
              <button className="text-sm text-primary font-medium">Copy</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Your API key is managed via environment variables and is not editable here.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-secondary flex items-center gap-2 mb-4"><Palette size={20} /> Appearance</h3>
           <div>
            <label className="text-sm font-medium text-gray-700">Theme</label>
            <p className="text-xs text-gray-500 mb-2">Theme selection is a demo feature.</p>
            <div className="flex gap-4">
              <button onClick={() => setSettings(prev => ({...prev, theme: 'light'}))} className={`px-4 py-2 rounded-lg border-2 ${settings.theme === 'light' ? 'border-primary' : 'border-gray-200'}`}>Light</button>
              <button onClick={() => setSettings(prev => ({...prev, theme: 'dark'}))} className={`px-4 py-2 rounded-lg border-2 ${settings.theme === 'dark' ? 'border-primary' : 'border-gray-200'}`}>Dark</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
