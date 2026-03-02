import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export default function Post10th({ user, setUser }: { user: any, setUser: any }) {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState<string | null>(user?.profile?.stream || null);
  const [showCBSE, setShowCBSE] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/streams')
      .then(res => res.json())
      .then(data => {
        setStreams(data);
        setLoading(false);
      });
  }, []);

  const handleSelectStream = async (streamId: string) => {
    setSelectedStream(streamId);
    const token = localStorage.getItem('token');
    
    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ profile: { stream: streamId } })
    });

    await fetch('/api/user/progress', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ phase: 1 })
    });

    setUser((prev: any) => ({
      ...prev,
      current_phase: Math.max(prev.current_phase, 2),
      completed_phases: Array.from(new Set([...prev.completed_phases, 1])),
      profile: { ...prev.profile, stream: streamId }
    }));
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading streams...</div>;

  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium uppercase tracking-wider text-sm">Phase 1</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Post-10th: The Crossroads</h1>
          <p className="text-slate-400 text-lg">Choose your stream to unlock engineering branches.</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button 
            onClick={() => setShowCBSE(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!showCBSE ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            State Board Names
          </button>
          <button 
            onClick={() => setShowCBSE(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showCBSE ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            CBSE Names
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-200">
          <strong className="text-blue-400">Did you know?</strong> State board names like MPC and BiPC are exactly the same as CBSE's PCM and PCB. They lead to identical career outcomes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {streams.map((stream, idx) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative p-6 rounded-2xl border transition-all cursor-pointer ${
              selectedStream === stream.id 
                ? 'bg-blue-900/20 border-blue-500 shadow-lg shadow-blue-500/10' 
                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
            }`}
            onClick={() => handleSelectStream(stream.id)}
          >
            {selectedStream === stream.id && (
              <div className="absolute top-6 right-6 text-blue-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-1">
                {showCBSE ? stream.board_equivalent : stream.name}
              </h3>
              <p className="text-slate-400 text-sm">
                {showCBSE ? stream.name : stream.board_equivalent} Equivalent
              </p>
            </div>

            <p className="text-slate-300 font-medium mb-6">{stream.description}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Career Doors Opened</h4>
                <div className="flex flex-wrap gap-2">
                  {stream.career_doors.map((door: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">
                      {door}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Famous Alumni</h4>
                <p className="text-sm text-slate-400">{stream.famous_alumni.join(', ')}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedStream && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end pt-8 border-t border-slate-800"
        >
          <button 
            onClick={() => navigate('/post-12th')}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center shadow-lg shadow-blue-500/25"
          >
            I've chosen my stream → Explore Degree Options
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
