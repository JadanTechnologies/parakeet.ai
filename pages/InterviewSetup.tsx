import React, { useState } from 'react';
import { InterviewMode } from '../types';
import { Briefcase, User, Settings, Play, Globe } from 'lucide-react';

interface Props {
  onStart: (data: any) => void;
  onBack: () => void;
}

const InterviewSetup: React.FC<Props> = ({ onStart, onBack }) => {
  const [name, setName] = useState('Alex Candidate');
  const [role, setRole] = useState('Software Engineer');
  const [industry, setIndustry] = useState('Tech');
  const [mode, setMode] = useState<InterviewMode>(InterviewMode.NORMAL);
  const [count, setCount] = useState(3);
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ name, role, industry, mode, count, language });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-secondary p-6 text-white flex justify-between items-center">
            <h2 className="text-2xl font-bold">Configure Session</h2>
            <button onClick={onBack} className="text-gray-300 hover:text-white text-sm">Cancel</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Candidate Name
                </label>
                <input 
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" /> Target Role
                    </label>
                    <input 
                        type="text" value={role} onChange={e => setRole(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        required
                    />
                </div>
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" /> Industry
                    </label>
                    <select 
                        value={industry} onChange={e => setIndustry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                    >
                        <option>Tech</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Marketing</option>
                        <option>Legal</option>
                    </select>
                </div>
            </div>
            
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" /> Language
                </label>
                <select 
                    value={language} onChange={e => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                </select>
            </div>


            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Interview Mode</label>
                <div className="grid grid-cols-3 gap-4">
                    {Object.values(InterviewMode).map((m) => (
                        <div 
                            key={m}
                            onClick={() => setMode(m)}
                            className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${
                                mode === m 
                                ? 'border-primary bg-blue-50 text-primary' 
                                : 'border-gray-100 hover:border-blue-100'
                            }`}
                        >
                            <div className="font-bold mb-1">{m}</div>
                            <div className="text-xs text-gray-500">
                                {m === 'Normal' ? 'Standard pace' : m === 'Hard' ? 'Deep technical' : 'Fast & Intense'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                 <label className="block text-sm font-medium text-gray-700">Question Count: {count}</label>
                 <input 
                    type="range" min="1" max="10" value={count} onChange={e => setCount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                 />
                 <div className="flex justify-between text-xs text-gray-400">
                    <span>1 Question</span>
                    <span>10 Questions</span>
                 </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-transform transform hover:-translate-y-1 flex items-center justify-center"
            >
                Start Interview <Play className="ml-2 fill-current" />
            </button>

            <p className="text-center text-xs text-gray-400">
                By starting, you agree to grant access to your microphone and camera for analysis.
            </p>
        </form>
      </div>
    </div>
  );
};

export default InterviewSetup;