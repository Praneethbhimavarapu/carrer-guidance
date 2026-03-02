import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Briefcase, Code, CheckCircle2, Star, Loader2, ArrowRight } from 'lucide-react';

export default function BranchDetail({ user, setUser }: { user: any, setUser: any }) {
  const { branchId, specId } = useParams();
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/careers/${specId}`)
      .then(res => res.json())
      .then(data => {
        setSpec(data);
        setLoading(false);
      });
  }, [specId]);

  const generateRoadmap = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          specialisation: specId,
          current_skills: ['Basic Programming', 'Mathematics'],
          target_timeline_months: 6,
          college_year: 2
        })
      });
      const data = await res.json();
      setRoadmap(data);
      
      // Update user profile
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profile: { branch: branchId, specialisation: specId } })
      });

      // Mark phase 2 complete
      await fetch('/api/user/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phase: 2 })
      });

      setUser((prev: any) => ({
        ...prev,
        current_phase: Math.max(prev.current_phase, 3),
        completed_phases: Array.from(new Set([...prev.completed_phases, 2])),
        profile: { ...prev.profile, branch: branchId, specialisation: specId }
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading details...</div>;
  if (!spec) return <div className="py-20 text-center text-slate-400">Specialization not found.</div>;

  return (
    <div className="space-y-12 py-8">
      <button 
        onClick={() => navigate('/post-12th')}
        className="flex items-center text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Branches
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl border border-slate-700">
              {spec.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">{spec.name}</h1>
              <div className="flex items-center space-x-3 text-sm font-medium text-slate-400">
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                  {spec.duration_years} Years
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                  {spec.difficulty} Difficulty
                </span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={generateRoadmap}
          disabled={generating}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold transition-all shadow-lg shadow-teal-500/25 flex items-center disabled:opacity-75"
        >
          {generating ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating AI Roadmap...</>
          ) : (
            <><Star className="w-5 h-5 mr-2" /> Generate My Personal Roadmap</>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {roadmap ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl bg-slate-900 border border-slate-800"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                Your Personalized Roadmap
              </h2>
              
              <div className="space-y-8">
                {roadmap.phases?.map((phase: any, pIdx: number) => (
                  <div key={pIdx} className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">{phase.title}</h3>
                    <div className="space-y-6">
                      {phase.weeks?.map((week: any, wIdx: number) => (
                        <div key={wIdx} className="border-l-2 border-slate-800 pl-4">
                          <h4 className="text-lg font-semibold text-white">{week.week}: {week.title}</h4>
                          <ul className="mt-2 space-y-2">
                            {week.tasks?.map((task: string, tIdx: number) => (
                              <li key={tIdx} className="flex items-start text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 mt-1 shrink-0" />
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <Link 
                  to="/btech-hub"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center"
                >
                  Go to B.Tech Hub
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <section className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Briefcase className="w-5 h-5 text-blue-400 mr-2" />
                  Career Roles & Salaries
                </h2>
                <div className="space-y-4">
                  {spec.roles.map((role: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div>
                        <div className="font-semibold text-white">{role.title}</div>
                        <div className="text-sm text-slate-400">{role.level} Level</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-teal-400">₹{role.avg_salary_lpa}L</div>
                        <div className="text-xs text-slate-500">per annum</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Code className="w-5 h-5 text-emerald-400 mr-2" />
                  Standard Roadmap Steps
                </h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                  {spec.roadmap_steps.map((step: any, idx: number) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 text-slate-400 group-[.is-active]:bg-blue-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {step.order}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-slate-950 border border-slate-800 shadow">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-white">{step.title}</h3>
                          <span className="text-xs font-medium text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">{step.duration_weeks} weeks</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Top Hiring Companies</h3>
            <div className="flex flex-wrap gap-2">
              {spec.top_companies.map((company: string, idx: number) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 text-sm border border-slate-800">
                  {company}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {spec.internship_skills.map((skill: string, idx: number) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-blue-900/20 text-blue-400 text-sm border border-blue-900/50">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Free Resources</h3>
            <div className="space-y-3">
              {spec.free_resources.map((res: any, idx: number) => (
                <a 
                  key={idx} 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{res.name}</span>
                  <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">{res.type}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
