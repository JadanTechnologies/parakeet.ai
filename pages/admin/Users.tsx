import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { UserProfile, InterviewSession } from '../../types';
import { PlusCircle, Edit, Trash2, Eye, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const Users: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(StorageService.getUsers());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<UserProfile> | null>(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserProfile | null>(null);
  const [userInterviews, setUserInterviews] = useState<InterviewSession[]>([]);

  const handleOpenEditModal = (user?: UserProfile) => {
    setCurrentUser(user || { id: '', name: '', email: '', role: '', interviewCount: 0, lastActivity: new Date().toISOString().split('T')[0] });
    setIsEditModalOpen(true);
  };
  
  const handleOpenDetailsModal = (user: UserProfile) => {
    const allInterviews = StorageService.getInterviews();
    const interviewsForUser = allInterviews.filter(iv => iv.candidateName === user.name);
    setUserInterviews(interviewsForUser);
    setSelectedUserForDetails(user);
  };

  const handleSave = () => {
    if (currentUser) {
      StorageService.saveUser(currentUser as UserProfile);
      setUsers(StorageService.getUsers());
      setIsEditModalOpen(false);
      setCurrentUser(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      StorageService.deleteUser(id);
      setUsers(StorageService.getUsers());
    }
  };
  
  const chartData = userInterviews.map((iv, index) => ({
    name: `Session ${index + 1}`,
    score: iv.overallScore
  }));

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen ml-64">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Candidate Management</h1>
          <p className="text-gray-500">View and manage candidate profiles.</p>
        </div>
        <button onClick={() => handleOpenEditModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <PlusCircle size={18} /> Add Candidate
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviews</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.interviewCount}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.lastActivity}</td>
                <td className="px-6 py-4 text-right text-sm font-medium flex justify-end items-center gap-4">
                  <button onClick={() => handleOpenDetailsModal(user)} className="text-gray-500 hover:text-primary" title="View Details"><Eye size={16}/></button>
                  <button onClick={() => handleOpenEditModal(user)} className="text-primary hover:text-blue-700" title="Edit User"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800" title="Delete User"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{currentUser.id ? 'Edit' : 'Add'} Candidate</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Name" value={currentUser.name} onChange={e => setCurrentUser({...currentUser, name: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
              <input type="email" placeholder="Email" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
              <input type="text" placeholder="Role" value={currentUser.role} onChange={e => setCurrentUser({...currentUser, role: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {selectedUserForDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl transform transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-secondary">{selectedUserForDetails.name}</h2>
                <p className="text-gray-500">{selectedUserForDetails.email} - {selectedUserForDetails.role}</p>
              </div>
              <button onClick={() => setSelectedUserForDetails(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-secondary mb-4">Performance Trend</h3>
              {userInterviews.length > 1 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#3E7BFA" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                  Not enough interview data to display a trend chart.
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-secondary mb-4">Interview History</h3>
              {userInterviews.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userInterviews.map(iv => (
                        <tr key={iv.id} className="bg-white border-b">
                          <td className="px-6 py-4 font-medium text-gray-900">{iv.jobRole}</td>
                          <td className="px-6 py-4">{new Date(iv.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold ${iv.overallScore > 75 ? 'text-green-600' : 'text-yellow-600'}`}>{iv.overallScore}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                  This candidate has not completed any interviews yet.
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
                <button onClick={() => setSelectedUserForDetails(null)} className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium transition-colors">
                    Close
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;