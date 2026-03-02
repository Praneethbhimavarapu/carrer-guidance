import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Github, Mail } from 'lucide-react';

export default function Login({ setUser }: { setUser: any }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        
        if (data.user.current_phase === 0) {
          navigate('/onboarding');
        } else if (data.user.current_phase === 1) {
          navigate('/post-10th');
        } else if (data.user.current_phase === 2) {
          navigate('/post-12th');
        } else {
          navigate('/btech-hub');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl"
      >
        <div className="text-center mb-8">
          <Compass className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to PathFinder</h2>
          <p className="text-slate-400 text-sm">Sign in to save your career journey progress.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Riya Sharma"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="riya@example.com"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Continue with Email'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-slate-500">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span>OR</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors">
            <Mail className="w-4 h-4 mr-2" /> Google
          </button>
          <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors">
            <Github className="w-4 h-4 mr-2" /> GitHub
          </button>
        </div>
      </motion.div>
    </div>
  );
}
