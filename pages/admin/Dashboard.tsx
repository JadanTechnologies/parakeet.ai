import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StorageService } from '../../services/storageService';
import { Users, Mic, Award, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const interviews = StorageService.getInterviews();
  const users = StorageService.getUsers();
  
  // Mock data for charts
  const activityData = [
    { name: 'Mon', interviews: 4 },
    { name: 'Tue', interviews: 7 },
    { name: 'Wed', interviews: 5 },
    { name: 'Thu', interviews: 12 },
    { name: 'Fri', interviews: 9 },
    { name: 'Sat', interviews: 3 },
    { name: 'Sun', interviews: 2 },
  ];

  const skillData = [
    { name: 'Frontend', value: 40 },
    { name: 'Backend', value: 30 },
    { name: 'Product', value: 20 },
    { name: 'Legal', value: 10 },
  ];

  const COLORS = ['#3E7BFA', '#F5C542', '#1B1F3B', '#00C49F'];

  const kpi = [
    { label: 'Total Interviews', value: interviews.length + 145, icon: Mic, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avg Score', value: '78%', icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Active Candidates', value: users.length + 24, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Conversion Rate', value: '12%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary">Overview</h1>
        <p className="text-gray-500">Welcome back, Administrator.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpi.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <div className={`p-4 rounded-xl ${item.bg} mr-4`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                    <h3 className="text-2xl font-bold text-secondary">{item.value}</h3>
                </div>
            </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-secondary mb-6">Interview Activity</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="interviews" stroke="#3E7BFA" strokeWidth={3} dot={{fill: '#3E7BFA', r: 4, strokeWidth: 2, stroke: '#fff'}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-secondary mb-6">Candidate Roles Distribution</h3>
            <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={skillData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {skillData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Recent Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-secondary">Recent Interviews</h3>
              <button className="text-sm text-primary font-medium">View All</button>
          </div>
          <table className="w-full">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {interviews.slice(-5).reverse().map((interview) => (
                      <tr key={interview.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                      {interview.candidateName.charAt(0)}
                                  </div>
                                  <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{interview.jobRole}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(interview.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  interview.overallScore > 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                  {interview.overallScore}%
                              </span>
                          </td>
                      </tr>
                  ))}
                  {interviews.length === 0 && (
                      <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No interviews recorded yet.</td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default Dashboard;