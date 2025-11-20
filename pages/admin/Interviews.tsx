import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { InterviewSession } from '../../types';
import { Eye } from 'lucide-react';

interface Props {
  onViewReport: (sessionId: string) => void;
}

const Interviews: React.FC<Props> = ({ onViewReport }) => {
  const [interviews] = useState<InterviewSession[]>(StorageService.getInterviews());

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen ml-64">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Interview History</h1>
          <p className="text-gray-500">Browse all completed interview sessions.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {interviews.map((interview) => (
                    <tr key={interview.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{interview.candidateName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.jobRole}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.language || 'English'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.mode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(interview.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${interview.overallScore > 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {interview.overallScore}%
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <button onClick={() => onViewReport(interview.id)} className="text-primary hover:text-blue-700 flex items-center gap-1">
                            <Eye size={16} /> View Report
                          </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {interviews.length === 0 && (
          <div className="text-center py-12 text-gray-500">No interviews found.</div>
        )}
      </div>
    </div>
  );
};

export default Interviews;