import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, ArrowRight, Lock } from 'lucide-react';

export default function Post12th({ user }: { user: any }) {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/branches')
      .then(res => res.json())
      .then(data => {
        setBranches(data);
        setLoading(false);
      });
  }, []);

  if (user?.current_phase < 1) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Phase Locked</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          You need to complete Phase 1 (Post-10th Stream Selection) before exploring engineering branches.
        </p>
        <button 
          onClick={() => navigate('/post-10th')}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Go to Phase 1
        </button>
      </div>
    );
  }

  if (loading) return <div className="py-20 text-center text-slate-400">Loading branches...</div>;

  return (
    <div className="space-y-12 py-8">
      <div>
        <div className="flex items-center space-x-2 text-teal-400 mb-2">
          <GraduationCap className="w-5 h-5" />
          <span className="font-medium uppercase tracking-wider text-sm">Phase 2</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Post-12th: The Deep Dive</h1>
        <p className="text-slate-400 text-lg">Explore engineering branches and their specializations.</p>
      </div>

      <div className="space-y-12">
        {branches.map((branch, idx) => (
          <motion.div 
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">{branch.name}</h2>
              <span className="text-sm font-medium text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {branch.specialisations.length} Specializations
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branch.specialisations.map((spec: any) => (
                <Link 
                  key={spec.id} 
                  to={`/post-12th/${branch.id}/${spec.id}`}
                  className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {spec.icon}
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-slate-950 text-xs font-medium text-slate-400 border border-slate-800">
                      {spec.difficulty} Difficulty
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                    {spec.name}
                  </h3>
                  
                  <div className="mt-auto pt-6 space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Top Roles</div>
                      <div className="flex flex-wrap gap-2">
                        {spec.roles.slice(0, 2).map((role: any, i: number) => (
                          <span key={i} className="text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                            {role.title}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                      <div className="text-sm font-medium text-slate-400">
                        ₹{spec.salary_range.min_lpa}L - ₹{spec.salary_range.max_lpa}L <span className="text-xs text-slate-500">/yr</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
