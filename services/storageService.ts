import { InterviewSession, Question, UserProfile, QuestionCategory, InterviewMode } from '../types';

const KEYS = {
  INTERVIEWS: 'parakeet_interviews',
  QUESTIONS: 'parakeet_questions',
  USERS: 'parakeet_users',
  SETTINGS: 'parakeet_settings'
};

// Seed Data
const seedQuestions: Question[] = [
  { id: '1', text: 'Tell me about a time you faced a conflict at work.', category: QuestionCategory.BEHAVIORAL, difficulty: 'Medium' },
  { id: '2', text: 'Explain the concept of recursion.', category: QuestionCategory.TECHNICAL, difficulty: 'Easy' },
  { id: '3', text: 'Why do you want to work here?', category: QuestionCategory.HR, difficulty: 'Easy' },
  { id: '4', text: 'How do you handle tight deadlines?', category: QuestionCategory.BEHAVIORAL, difficulty: 'Medium' },
  { id: '5', text: 'Design a system for a URL shortener.', category: QuestionCategory.TECHNICAL, difficulty: 'Hard' },
];

const seedUsers: UserProfile[] = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'Frontend Dev', interviewCount: 3, lastActivity: '2023-10-25' },
  { id: 'u2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Product Manager', interviewCount: 1, lastActivity: '2023-10-24' },
  { id: 'u3', name: 'Mike Ross', email: 'mike@example.com', role: 'Legal', interviewCount: 5, lastActivity: '2023-10-20' },
];

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(KEYS.QUESTIONS)) {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(seedQuestions));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
    }
    if (!localStorage.getItem(KEYS.INTERVIEWS)) {
      localStorage.setItem(KEYS.INTERVIEWS, JSON.stringify([]));
    }
  },

  getQuestions: (): Question[] => {
    return JSON.parse(localStorage.getItem(KEYS.QUESTIONS) || '[]');
  },

  saveQuestion: (q: Question) => {
    const questions = StorageService.getQuestions();
    const existing = questions.findIndex(x => x.id === q.id);
    if (existing >= 0) {
      questions[existing] = q;
    } else {
      questions.push({ ...q, id: Date.now().toString() });
    }
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  },

  deleteQuestion: (id: string) => {
    const questions = StorageService.getQuestions().filter(q => q.id !== id);
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  },

  getInterviews: (): InterviewSession[] => {
    return JSON.parse(localStorage.getItem(KEYS.INTERVIEWS) || '[]');
  },

  saveInterview: (session: InterviewSession) => {
    const sessions = StorageService.getInterviews();
    sessions.push(session);
    localStorage.setItem(KEYS.INTERVIEWS, JSON.stringify(sessions));
    
    // Update dummy analytics based on this new interview
    StorageService.updateUserStats(session);
  },

  getUsers: (): UserProfile[] => {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  saveUser: (user: UserProfile) => {
    const users = StorageService.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex > -1) {
      users[existingIndex] = user;
    } else {
      users.push({ ...user, id: user.id || `u${Date.now()}` });
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  
  deleteUser: (id: string) => {
    const users = StorageService.getUsers().filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  updateUserStats: (session: InterviewSession) => {
    // For demo, just add a dummy user or update existing if we had auth
    // Here we just ensure stats look alive
  }
};

StorageService.init();