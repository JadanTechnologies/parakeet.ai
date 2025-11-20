import React from 'react';
import { CheckCircle, Download, Home, ChevronDown, AlertTriangle } from 'lucide-react';
import { InterviewSession } from '../types';
import { StorageService } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Props {
  sessionId: string;
  onHome: () => void;
}

const ReportPage: React.FC<Props> = ({ sessionId, onHome }) => {
  const [session, setSession] = React.useState<InterviewSession | null>(null);
  const [expandedQ, setExpandedQ] = React.useState<string | null>(null);

  React.useEffect(() => {
    const interviews = StorageService.getInterviews();
    const found = interviews.find(i => i.id === sessionId);
    if (found) setSession(found);
  }, [sessionId]);

  if (!session) return <div>Loading...</div>;

  const scoreData = session.records.map((r, i) => ({
    name: `Q${i+1}`,
    score: (r.evaluation.clarity + r.evaluation.relevance + r.evaluation.confidence) / 3
  }));

  // Calculate average metrics
  const avgMetrics = session.records.reduce((acc, curr) => ({
    clarity: acc.clarity + curr.evaluation.clarity,
    confidence: acc.confidence + curr.evaluation.confidence,
    structure: acc.structure + curr.evaluation.structure,
    relevance: acc.relevance + curr.evaluation.relevance,
    professionalism: acc.professionalism + curr.evaluation.professionalism,
  }), { clarity: 0, confidence: 0, structure: 0, relevance: 0, professionalism: 0 });

  const radarData = Object.keys(avgMetrics).map(key => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    A: Math.round(avgMetrics[key as keyof typeof avgMetrics] / session.records.length),
    fullMark: 100
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-secondary text-white pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex justify-between items-center mb-8">
             <h1 className="text-3xl font-bold">Interview Report</h1>
             <button onClick={onHome} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm flex items-center">
                <Home className="mr-2 h-4 w-4" /> Back Home
             </button>
          </div>
          <div className="flex items-center space-x-8">
             <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className={`${session.overallScore > 70 ? 'text-green-500' : 'text-accent'}`} strokeDasharray={351} strokeDashoffset={351 - (351 * session.overallScore) / 100} />
                </svg>
                <div className="absolute text-3xl font-bold">{session.overallScore}</div>
             </div>
             <div>
                <h2 className="text-2xl font-bold">{session.jobRole}</h2>
                <p className="text-gray-400">{session.candidateName} • {new Date(session.date).toLocaleDateString()}</p>
                <div className="mt-2 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-sm">Role Fit: {session.overallScore > 75 ? 'High' : 'Medium'}</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-sm">{session.mode} Mode</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Charts */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-secondary mb-6">Performance Trend</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreData}>
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Bar dataKey="score" fill="#3E7BFA" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-secondary">Question Breakdown</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {session.records.map((rec, idx) => (
                            <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                                <div 
                                    className="flex justify-between items-start cursor-pointer"
                                    onClick={() => setExpandedQ(expandedQ === rec.questionId ? null : rec.questionId)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Q{idx+1}</span>
                                            <h4 className="font-medium text-secondary">{rec.questionText}</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-1">{rec.userAnswer}</p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4">
                                        <div className={`text-lg font-bold ${rec.evaluation.relevance > 70 ? 'text-green-600' : 'text-orange-500'}`}>
                                            {Math.round((rec.evaluation.clarity + rec.evaluation.relevance)/2)}/100
                                        </div>
                                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedQ === rec.questionId ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                
                                {expandedQ === rec.questionId && (
                                    <div className="mt-4 pl-4 border-l-2 border-primary/20 space-y-4 animate-fadeIn">
                                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic">
                                            "{rec.userAnswer}"
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">AI Feedback:</span>
                                                <p className="mt-1 text-secondary font-medium">{rec.evaluation.feedback}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Improvements:</span>
                                                <ul className="mt-1 list-disc list-inside text-red-500">
                                                    {rec.evaluation.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-secondary mb-4">Skill Radar</h3>
                    <div className="h-64 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Candidate" dataKey="A" stroke="#3E7BFA" fill="#3E7BFA" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold text-secondary mb-4">Actions</h3>
                    <button className="w-full flex items-center justify-center bg-secondary text-white py-3 rounded-xl font-medium mb-3 hover:bg-gray-800">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </button>
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-sm text-yellow-800 flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        Video recording was simulated for this demo. Only transcripts and scores are persistent.
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;