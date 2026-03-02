import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20"
        >
          <Compass className="w-4 h-4 mr-2" />
          For Indian Students
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          From 10th Grade to Your <br />
          <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Dream Job
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto"
        >
          Navigate the complex Indian education system with a personalized, step-by-step roadmap tailored to your skills and interests.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/auth/login" className="inline-flex items-center px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
            Start My Career Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-slate-800 py-8 bg-slate-900/50">
        {[
          { label: 'Colleges', value: '50+' },
          { label: 'Career Paths', value: '20+' },
          { label: 'Job Roles', value: '100+' },
          { label: 'Students Guided', value: '10k+' }
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Phase Overview */}
      <section className="w-full max-w-5xl space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">The Four-Phase Journey</h2>
          <p className="text-slate-400">Unlock each phase as you progress through your education.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <PhaseCard 
            phase="Phase 1"
            title="Post-10th: The Crossroads"
            description="Choose the right stream (MPC, BiPC, CEC, HEC) based on your interests."
            icon={<BookOpen className="w-8 h-8 text-blue-400" />}
            unlocked={true}
          />
          <PhaseCard 
            phase="Phase 2"
            title="Post-12th: The Deep Dive"
            description="Explore engineering branches and specializations."
            icon={<GraduationCap className="w-8 h-8 text-teal-400" />}
            unlocked={false}
          />
          <PhaseCard 
            phase="Phase 3"
            title="B.Tech Hub: Execution"
            description="Find colleges, internships, and build your skill roadmap."
            icon={<Briefcase className="w-8 h-8 text-emerald-400" />}
            unlocked={false}
          />
        </div>
      </section>
    </div>
  );
}

function PhaseCard({ phase, title, description, icon, unlocked }: any) {
  return (
    <div className={`relative p-6 rounded-2xl border ${unlocked ? 'border-slate-700 bg-slate-900' : 'border-slate-800 bg-slate-900/50 opacity-75'} overflow-hidden`}>
      {!unlocked && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">
            Locked
          </div>
        </div>
      )}
      <div className="mb-4">{icon}</div>
      <div className="text-sm font-medium text-slate-400 mb-2">{phase}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
