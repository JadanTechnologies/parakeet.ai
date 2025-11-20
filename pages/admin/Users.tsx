import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { UserProfile } from '../../types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(StorageService.getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<UserProfile> | null>(null);

  const handleOpenModal = (user?: UserProfile) => {
    setCurrentUser(user || { id: '', name: '', email: '', role: '', interviewCount: 0, lastActivity: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentUser) {
      StorageService.saveUser(currentUser as UserProfile);
      setUsers(StorageService.getUsers());
      setIsModalOpen(false);
      setCurrentUser(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      StorageService.deleteUser(id);
      setUsers(StorageService.getUsers());
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen ml-64">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Candidate Management</h1>
          <p className="text-gray-500">View and manage candidate profiles.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
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
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.interviewCount}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.lastActivity}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(user)} className="text-primary hover:text-blue-700 mr-4"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{currentUser.id ? 'Edit' : 'Add'} Candidate</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Name" value={currentUser.name} onChange={e => setCurrentUser({...currentUser, name: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
              <input type="email" placeholder="Email" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
              <input type="text" placeholder="Role" value={currentUser.role} onChange={e => setCurrentUser({...currentUser, role: e.target.value})} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
