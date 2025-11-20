export enum InterviewMode {
  NORMAL = 'Normal',
  HARD = 'Hard',
  STRESS = 'Stress'
}

export enum QuestionCategory {
  HR = 'HR',
  TECHNICAL = 'Technical',
  BEHAVIORAL = 'Behavioral'
}

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Evaluation {
  clarity: number;
  confidence: number;
  structure: number;
  relevance: number;
  professionalism: number;
  feedback: string;
  improvements: string[];
}

export interface QARecord {
  questionId: string;
  questionText: string;
  userAnswer: string;
  evaluation: Evaluation;
  timestamp: number;
}

export interface InterviewSession {
  id: string;
  candidateName: string;
  jobRole: string;
  industry: string;
  mode: InterviewMode;
  date: string;
  overallScore: number;
  status: 'Completed' | 'Incomplete';
  records: QARecord[];
}

export interface AdminStats {
  totalInterviews: number;
  avgScore: number;
  topRole: string;
  activeUsers: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  interviewCount: number;
  lastActivity: string;
}

// Gemini Types
export interface GeneratedQuestionResponse {
  questions: {
    text: string;
    difficulty: string;
    category: string;
  }[];
}

export interface EvaluationResponse {
  clarity: number;
  confidence: number;
  structure: number;
  relevance: number;
  professionalism: number;
  feedback: string;
  improvements: string[];
}