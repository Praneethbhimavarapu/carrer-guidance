import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const questions = [
  {
    id: 1,
    text: "What subject do you enjoy most in school?",
    options: [
      { text: "Mathematics & Physics", stream: "mpc" },
      { text: "Biology & Chemistry", stream: "bipc" },
      { text: "Economics & Accounting", stream: "cec" },
      { text: "History & Political Science", stream: "hec" }
    ]
  },
  {
    id: 2,
    text: "Which activity describes you best?",
    options: [
      { text: "Building things and solving logic puzzles", stream: "mpc" },
      { text: "Understanding how living things work", stream: "bipc" },
      { text: "Managing money and organizing events", stream: "cec" },
      { text: "Reading, writing, and debating ideas", stream: "hec" }
    ]
  },
  {
    id: 3,
    text: "What is your dream career outcome?",
    options: [
      { text: "Software Engineer or Architect", stream: "mpc" },
      { text: "Doctor or Researcher", stream: "bipc" },
      { text: "Chartered Accountant or CEO", stream: "cec" },
      { text: "Civil Servant or Journalist", stream: "hec" }
    ]
  },
  {
    id: 4,
    text: "Which environment do you prefer working in?",
    options: [
      { text: "Tech labs and computer screens", stream: "mpc" },
      { text: "Hospitals, clinics, or nature", stream: "bipc" },
      { text: "Corporate offices and boardrooms", stream: "cec" },
      { text: "Courts, media houses, or NGOs", stream: "hec" }
    ]
  },
  {
    id: 5,
    text: "How do you approach problem-solving?",
    options: [
      { text: "Using formulas, logic, and algorithms", stream: "mpc" },
      { text: "Observing patterns in nature and biology", stream: "bipc" },
      { text: "Analyzing financial data and market trends", stream: "cec" },
      { text: "Understanding human behavior and society", stream: "hec" }
    ]
  }
];

export default function Onboarding({ user, setUser }: { user: any, setUser: any }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAnswer = (stream: string) => {
    setAnswers({ ...answers, [currentStep]: stream });
    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const counts: Record<string, number> = { mpc: 0, bipc: 0, cec: 0, hec: 0 };
    Object.values(answers).forEach(stream => {
      if (typeof stream === 'string') {
        counts[stream]++;
      }
    });
    
    let maxStream = 'mpc';
    let maxCount = 0;
    for (const [stream, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        maxStream = stream;
      }
    }
    setResult(maxStream);
  };

  const completeOnboarding = async () => {
    const token = localStorage.getItem('token');
    
    // Update profile
    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ profile: { recommended_stream: result } })
    });

    // Mark phase 0 complete
    await fetch('/api/user/progress', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ phase: 0 })
    });

    setUser({ ...user, current_phase: 1, profile: { ...user.profile, recommended_stream: result } });
    navigate('/post-10th');
  };

  if (result) {
    const streamNames: Record<string, string> = {
      mpc: 'MPC (Mathematics, Physics, Chemistry)',
      bipc: 'BiPC (Biology, Physics, Chemistry)',
      cec: 'CEC (Civics, Economics, Commerce)',
      hec: 'HEC (History, Economics, Civics)'
    };

    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-slate-900 border border-slate-800"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Your Recommended Stream</h2>
          <div className="text-2xl font-bold text-blue-400 mb-6">{streamNames[result]}</div>
          <p className="text-slate-400 mb-8">
            Based on your interests, this stream aligns best with your natural strengths and career goals.
          </p>
          <button 
            onClick={completeOnboarding}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center mx-auto"
          >
            Explore This Stream
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => setCurrentStep(curr => Math.max(0, curr - 1))}
          disabled={currentStep === 0}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-sm font-medium text-slate-400">
          Question {currentStep + 1} of {questions.length}
        </div>
        <div className="w-9"></div>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-white text-center leading-tight">
            {question.text}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.stream)}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg text-slate-200 group-hover:text-white">{option.text}</span>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-700 group-hover:border-blue-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
