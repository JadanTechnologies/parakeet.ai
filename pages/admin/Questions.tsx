import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { Question, QuestionCategory } from '../../types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(StorageService.getQuestions());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question> | null>(null);

  const handleOpenModal = (q?: Question) => {
    setCurrentQuestion(q || { id: '', text: '', category: QuestionCategory.BEHAVIORAL, difficulty: 'Medium' });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentQuestion) {
      StorageService.saveQuestion(currentQuestion as Question);
      setQuestions(StorageService.getQuestions());
      setIsModalOpen(false);
      setCurrentQuestion(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      StorageService.deleteQuestion(id);
      setQuestions(StorageService.getQuestions());
    }
  };
  
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen ml-64">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Question Bank</h1>
          <p className="text-gray-500">Manage your interview questions.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <PlusCircle size={18} /> Add Question
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Text</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((q) => (
              <tr key={q.id}>
                <td className="px-6 py-4 text-sm text-gray-800 max-w-md truncate">{q.text}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{q.category}</td>
                <td className="px-6 py-4 text-sm">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : q.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {q.difficulty}
                    </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(q)} className="text-primary hover:text-blue-700 mr-4"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{currentQuestion.id ? 'Edit' : 'Add'} Question</h2>
            <div className="space-y-4">
               <textarea 
                    value={currentQuestion.text} 
                    onChange={e => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                    placeholder="Question Text"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md"
                />
               <select value={currentQuestion.category} onChange={e => setCurrentQuestion({...currentQuestion, category: e.target.value as QuestionCategory})} className="w-full px-4 py-2 border rounded-md bg-white">
                    {Object.values(QuestionCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
               <select value={currentQuestion.difficulty} onChange={e => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})} className="w-full px-4 py-2 border rounded-md bg-white">
                   <option>Easy</option>
                   <option>Medium</option>
                   <option>Hard</option>
               </select>
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

export default Questions;
