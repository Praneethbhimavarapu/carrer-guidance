import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, CheckCircle2, Lock, BookOpen, GraduationCap, Briefcase, MessageSquare, Loader2, ArrowRight } from 'lucide-react';

export default function Dashboard({ user }: { user: any }) {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
  const [sending, setSending] = useState(false);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', content: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');
    setSending(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: chatMessage, history: newHistory })
      });
      const data = await res.json();
      setChatHistory([...newHistory, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-12 py-8">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl border-4 border-slate-900 shadow-xl">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
          <p className="text-slate-400 text-lg">{user.email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Your Journey Progress</h2>
            
            <div className="space-y-6">
              <ProgressStep 
                phase="Phase 1"
                title="Post-10th Stream Selection"
                icon={<BookOpen className="w-5 h-5" />}
                completed={user.completed_phases.includes(1)}
                active={user.current_phase === 1}
              />
              <ProgressStep 
                phase="Phase 2"
                title="Engineering Branch Explorer"
                icon={<GraduationCap className="w-5 h-5" />}
                completed={user.completed_phases.includes(2)}
                active={user.current_phase === 2}
              />
              <ProgressStep 
                phase="Phase 3"
                title="B.Tech Hub & Internships"
                icon={<Briefcase className="w-5 h-5" />}
                completed={user.completed_phases.includes(3)}
                active={user.current_phase === 3}
              />
            </div>
          </section>

          <section className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Saved Items</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{user.saved_colleges.length}</div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Saved Colleges</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-4xl font-bold text-teal-400 mb-2">{user.saved_internships.length}</div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Saved Internships</div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 h-[600px] flex flex-col">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Ask PathFinder AI</h2>
                <p className="text-xs text-slate-400">Career Counsellor Chatbot</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
              {chatHistory.length === 0 && (
                <div className="text-center text-slate-500 text-sm mt-10">
                  Ask me anything about streams, branches, colleges, or internships in India!
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-slate-800 text-slate-400 rounded-bl-sm border border-slate-700 flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Thinking...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleChat} className="relative mt-auto">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your question..." 
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              />
              <button 
                type="submit"
                disabled={sending || !chatMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProgressStep({ phase, title, icon, completed, active }: any) {
  return (
    <div className={`flex items-center p-4 rounded-xl border ${
      completed ? 'bg-emerald-900/20 border-emerald-500/30' : 
      active ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 
      'bg-slate-950 border-slate-800 opacity-50'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${
        completed ? 'bg-emerald-500/20 text-emerald-400' : 
        active ? 'bg-blue-500/20 text-blue-400' : 
        'bg-slate-900 text-slate-500'
      }`}>
        {completed ? <CheckCircle2 className="w-6 h-6" /> : active ? icon : <Lock className="w-5 h-5" />}
      </div>
      <div>
        <div className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
          completed ? 'text-emerald-500' : active ? 'text-blue-400' : 'text-slate-500'
        }`}>{phase}</div>
        <div className={`font-bold ${completed || active ? 'text-white' : 'text-slate-400'}`}>{title}</div>
      </div>
    </div>
  );
}
