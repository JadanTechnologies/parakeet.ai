import { GoogleGenAI, Type } from "@google/genai";
import { InterviewMode, EvaluationResponse, GeneratedQuestionResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Helper to ensure we have a client. In a real app, manage this better.
const getAiClient = () => {
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
};

export const generateInterviewQuestions = async (
  role: string,
  industry: string,
  mode: InterviewMode,
  count: number,
  language: string
): Promise<GeneratedQuestionResponse> => {
  const ai = getAiClient();
  
  let difficultyPrompt = "standard difficulty";
  if (mode === InterviewMode.HARD) difficultyPrompt = "very challenging and in-depth";
  if (mode === InterviewMode.STRESS) difficultyPrompt = "intense, pressure-testing, and slightly confrontational";

  const prompt = `Generate ${count} interview questions for a ${role} position in the ${industry} industry, in ${language}.
  The tone should be ${difficultyPrompt}. Mix technical and behavioral questions.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The interview question text" },
            difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
            category: { type: Type.STRING, description: "Technical, HR, or Behavioral" }
          },
          required: ["text", "difficulty", "category"]
        }
      }
    },
    required: ["questions"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert technical recruiter and hiring manager."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as GeneratedQuestionResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback for demo purposes if API fails
    return {
      questions: Array(count).fill(null).map((_, i) => ({
        text: `Could you tell me about your experience relevant to ${role}? (Fallback question ${i+1})`,
        difficulty: 'Medium',
        category: 'General'
      }))
    };
  }
};

export const evaluateAnswer = async (
  question: string,
  answer: string,
  role: string,
  language: string
): Promise<EvaluationResponse> => {
  const ai = getAiClient();

  const prompt = `Evaluate this interview answer for a ${role} role. The interview is in ${language}, so provide all feedback and analysis in ${language}.
  Question: "${question}"
  Candidate Answer: "${answer}"
  
  Rate from 0-100 on criteria. Provide constructive feedback.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      clarity: { type: Type.NUMBER, description: "0-100 score" },
      confidence: { type: Type.NUMBER, description: "0-100 score inferred from tone" },
      structure: { type: Type.NUMBER, description: "0-100 score" },
      relevance: { type: Type.NUMBER, description: "0-100 score" },
      professionalism: { type: Type.NUMBER, description: "0-100 score" },
      feedback: { type: Type.STRING, description: "Short summary of performance" },
      improvements: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3 specific tips to improve"
      }
    },
    required: ["clarity", "confidence", "structure", "relevance", "professionalism", "feedback", "improvements"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as EvaluationResponse;
  } catch (error) {
    console.error("Evaluation Error", error);
    return {
      clarity: 50, confidence: 50, structure: 50, relevance: 50, professionalism: 50,
      feedback: "Could not analyze answer (AI Error).",
      improvements: ["Check internet connection", "Try shorter answers"]
    };
  }
};