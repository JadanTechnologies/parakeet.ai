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
  { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'Frontend Dev', interviewCount: 2, lastActivity: '2023-10-25' },
  { id: 'u2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Product Manager', interviewCount: 1, lastActivity: '2023-10-24' },
  { id: 'u3', name: 'Mike Ross', email: 'mike@example.com', role: 'Legal', interviewCount: 0, lastActivity: '2023-10-20' },
];

const seedInterviews: InterviewSession[] = [
    {
        id: 'iv1',
        candidateName: 'John Doe',
        jobRole: 'Frontend Dev',
        industry: 'Tech',
        mode: InterviewMode.NORMAL,
        language: 'English',
        date: new Date(new Date().setDate(new Date().getDate()-10)).toISOString(),
        overallScore: 72,
        status: 'Completed',
        records: [
            { questionId: 'q1', questionText: 'Describe your experience with React.', userAnswer: 'I have been working with React for 5 years and have built several complex applications, focusing on performance and scalability.', evaluation: { clarity: 80, confidence: 75, structure: 70, relevance: 85, professionalism: 80, feedback: 'Good, solid answer. Provided clear examples.', improvements: ['Provide more specific metrics on project impact.'] }, timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000 },
            { questionId: 'q2', questionText: 'How do you handle state management in large applications?', userAnswer: 'I primarily use Redux Toolkit for its predictability and excellent dev tools. For simpler cases, React Context is sufficient.', evaluation: { clarity: 60, confidence: 65, structure: 70, relevance: 75, professionalism: 70, feedback: 'A bit technical and hard to follow for a non-technical interviewer.', improvements: ['Try to simplify the explanation using an analogy.'] }, timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000 + 300000 }
        ]
    },
    {
        id: 'iv2',
        candidateName: 'John Doe',
        jobRole: 'Senior Frontend Dev',
        industry: 'Tech',
        mode: InterviewMode.HARD,
        language: 'English',
        date: new Date(new Date().setDate(new Date().getDate()-3)).toISOString(),
        overallScore: 81,
        status: 'Completed',
        records: [
            { questionId: 'q3', questionText: 'Explain the internals of the React reconciliation algorithm.', userAnswer: 'React Fiber is the new reconciliation engine, which allows for incremental rendering. It splits work into chunks and prioritizes them...', evaluation: { clarity: 85, confidence: 80, structure: 80, relevance: 90, professionalism: 85, feedback: 'Excellent technical depth and clear explanation of a complex topic.', improvements: ['Could mention how this impacts Concurrent Mode.'] }, timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
        ]
    },
    {
        id: 'iv3',
        candidateName: 'Sarah Smith',
        jobRole: 'Product Manager',
        industry: 'Tech',
        mode: InterviewMode.NORMAL,
        language: 'English',
        date: new Date(new Date().setDate(new Date().getDate()-1)).toISOString(),
        overallScore: 88,
        status: 'Completed',
        records: [
             { questionId: 'q4', questionText: 'How do you prioritize features for a new product?', userAnswer: 'I use a combination of frameworks like RICE and MoSCoW, balanced with user research data and stakeholder input to align with business goals.', evaluation: { clarity: 90, confidence: 90, structure: 85, relevance: 95, professionalism: 90, feedback: 'Very structured and clear answer, showing a strong understanding of product strategy.', improvements: ['Could elaborate more on handling conflicting stakeholder requests.'] }, timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 },
        ]
    }
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
      localStorage.setItem(KEYS.INTERVIEWS, JSON.stringify(seedInterviews));
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