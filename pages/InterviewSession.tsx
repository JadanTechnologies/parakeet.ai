import React, { useState, useEffect, useRef } from 'react';
import { Mic, Camera, StopCircle, Send, RefreshCw, Video, VideoOff } from 'lucide-react';
import { generateInterviewQuestions, evaluateAnswer } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { InterviewMode, QARecord, InterviewSession } from '../types';

interface Props {
  setupData: {
    role: string;
    industry: string;
    mode: InterviewMode;
    count: number;
    name: string;
  };
  onFinish: (sessionId: string) => void;
}

const InterviewSessionPage: React.FC<Props> = ({ setupData, onFinish }) => {
  const [status, setStatus] = useState<'init' | 'loading' | 'interviewing' | 'processing' | 'completed'>('init');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [records, setRecords] = useState<QARecord[]>([]);
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Speech Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const initSession = async () => {
      setStatus('loading');
      try {
        const qResponse = await generateInterviewQuestions(setupData.role, setupData.industry, setupData.mode, setupData.count);
        setQuestions(qResponse.questions);
        setStatus('interviewing');
        startTimer();
        initCamera();
        speak(qResponse.questions[0].text);
      } catch (e) {
        alert("Failed to generate questions. Please check API key.");
      }
    };
    initSession();

    // Setup Speech Recognition
    if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setUserAnswer(prev => prev + " " + event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };
    }

    return () => {
       if (videoRef.current?.srcObject) {
         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
       }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.error("Camera access denied", e);
      setVideoEnabled(false);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsRecording(false);
    } else {
        setUserAnswer('');
        if (recognitionRef.current) recognitionRef.current.start();
        setIsRecording(true);
    }
  };

  const handleNext = async () => {
    if (isRecording) toggleRecording();
    setStatus('processing');

    // Evaluate Answer
    const currentQ = questions[currentQIndex];
    const evaluation = await evaluateAnswer(currentQ.text, userAnswer || "No answer provided.", setupData.role);
    
    const newRecord: QARecord = {
        questionId: currentQIndex.toString(),
        questionText: currentQ.text,
        userAnswer: userAnswer || "No answer provided.",
        evaluation: evaluation,
        timestamp: Date.now()
    };
    
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    setUserAnswer('');

    if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setStatus('interviewing');
        speak(questions[currentQIndex + 1].text);
    } else {
        finishSession(updatedRecords);
    }
  };

  const finishSession = (finalRecords: QARecord[]) => {
    setStatus('completed');
    // Calculate overall score
    const totalScore = finalRecords.reduce((acc, r) => 
        acc + (r.evaluation.clarity + r.evaluation.confidence + r.evaluation.relevance)/3, 0
    ) / finalRecords.length;

    const session: InterviewSession = {
        id: Date.now().toString(),
        candidateName: setupData.name,
        jobRole: setupData.role,
        industry: setupData.industry,
        mode: setupData.mode,
        date: new Date().toISOString(),
        overallScore: Math.round(totalScore),
        status: 'Completed',
        records: finalRecords
    };

    StorageService.saveInterview(session);
    onFinish(session.id);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'loading') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-secondary">Generating your interview...</h2>
                <p className="text-gray-500">Consulting Gemini AI for the best questions.</p>
            </div>
        </div>
    );
  }

  if (status === 'processing') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
             <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full animate-bounce mx-auto mb-4 flex items-center justify-center">
                    <RefreshCw className="text-white animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-secondary">Evaluating Answer...</h2>
            </div>
        </div>
    );
  }

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-secondary">{setupData.role} Interview</h1>
            <span className="text-sm text-gray-500">{setupData.mode} Mode • {questions.length} Questions</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border font-mono font-medium text-primary">
            {formatTime(timer)}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI & Question */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Webcam Area */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl group">
                {videoEnabled ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <VideoOff className="h-12 w-12 mb-2" />
                        <p>Camera Disabled</p>
                    </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm backdrop-blur-sm">
                    Candidate Feed
                </div>
                {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        Recording
                    </div>
                )}
            </div>

            {/* Question Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col justify-center">
                <span className="text-sm font-bold text-accent uppercase tracking-wide mb-2">Question {currentQIndex + 1} of {questions.length}</span>
                <h2 className="text-2xl md:text-3xl font-medium text-secondary leading-tight">
                    "{currentQuestion?.text}"
                </h2>
            </div>
        </div>

        {/* Right: Controls & Transcript */}
        <div className="flex flex-col gap-6">
            {/* Transcript Box */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col">
                <h3 className="font-bold text-secondary mb-4 flex items-center">
                    <Mic className="h-5 w-5 mr-2 text-primary" /> Real-time Transcript
                </h3>
                <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-y-auto mb-4 text-gray-600 min-h-[200px]">
                    {userAnswer || <span className="text-gray-400 italic">Your answer will appear here...</span>}
                </div>
                
                <textarea 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Or type your answer manually here..."
                    className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none mb-4"
                    rows={3}
                />

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={toggleRecording}
                        className={`flex items-center justify-center py-3 rounded-xl font-bold transition-colors ${
                            isRecording 
                            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                            : 'bg-secondary text-white hover:bg-gray-800'
                        }`}
                    >
                        {isRecording ? <><StopCircle className="mr-2" /> Stop</> : <><Mic className="mr-2" /> Answer</>}
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={userAnswer.length < 5}
                        className="flex items-center justify-center bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next <Send className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <strong>Tip:</strong> Speak clearly and maintain eye contact with the camera. The AI analyzes your visual confidence.
            </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;