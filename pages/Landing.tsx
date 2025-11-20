import React from 'react';
import { Mic, Play, ShieldCheck, BarChart3 } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const Landing: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-white pb-16 pt-20 lg:pb-32 lg:pt-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-primary mb-6 border border-blue-100">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                New: Gemini 2.5 Integration
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-secondary sm:text-6xl mb-6">
                Master Your Next <br/>
                <span className="text-primary">Interview with AI</span>
              </h1>
              <p className="mt-4 text-xl text-gray-500 mb-8">
                Parakeet clones real interview scenarios. Get real-time feedback on your confidence, clarity, and technical accuracy.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={onStart}
                  className="rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-500/30 hover:bg-blue-600 transition-all transform hover:-translate-y-1"
                >
                  Start Practice Now
                </button>
                <button className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-secondary border border-gray-200 hover:bg-gray-50 transition-all flex items-center">
                  <Play className="mr-2 h-5 w-5" /> Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
              <img 
                src="https://picsum.photos/800/600?grayscale" 
                alt="App Dashboard" 
                className="relative rounded-2xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary">Why Choose Parakeet?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Mic, title: "Voice Analysis", desc: "Our AI analyzes your tone, pace, and confidence levels in real-time." },
              { icon: ShieldCheck, title: "Technical Vetting", desc: "Role-specific questions generated dynamically based on your level." },
              { icon: BarChart3, title: "Detailed Reports", desc: "Get a comprehensive scorecard breakdown after every session." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;