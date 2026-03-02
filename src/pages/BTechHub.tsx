import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Briefcase, MapPin, Search, Bookmark, BookmarkCheck, Lock } from 'lucide-react';

export default function BTechHub({ user, setUser }: { user: any, setUser: any }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (user?.current_phase < 2) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Phase Locked</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          You need to complete Phase 2 (Branch Selection) before accessing the B.Tech Hub.
        </p>
        <button 
          onClick={() => navigate('/post-12th')}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Go to Phase 2
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <div>
        <div className="flex items-center space-x-2 text-emerald-400 mb-2">
          <Briefcase className="w-5 h-5" />
          <span className="font-medium uppercase tracking-wider text-sm">Phase 3</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">B.Tech Hub: Execution</h1>
        <p className="text-slate-400 text-lg">Find colleges, internships, and build your profile.</p>
      </div>

      <div className="flex space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
        <Link 
          to="/btech-hub/colleges" 
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.includes('/colleges') || location.pathname === '/btech-hub' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
        >
          College Finder
        </Link>
        <Link 
          to="/btech-hub/internships" 
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.includes('/internships') ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
        >
          Internship Portal
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<CollegeFinder user={user} setUser={setUser} />} />
        <Route path="colleges" element={<CollegeFinder user={user} setUser={setUser} />} />
        <Route path="internships" element={<InternshipPortal user={user} setUser={setUser} />} />
      </Routes>
    </div>
  );
}

function CollegeFinder({ user, setUser }: { user: any, setUser: any }) {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string[]>(user.saved_colleges || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetch('/api/colleges')
      .then(res => res.json())
      .then(data => {
        setColleges(data);
        setLoading(false);
      });
  }, []);

  const toggleSave = async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/user/save/college/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setSaved(data.saved);
    setUser((prev: any) => ({ ...prev, saved_colleges: data.saved }));
  };

  const filteredColleges = colleges.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter ? c.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  if (loading) return <div className="py-12 text-center text-slate-400">Loading colleges...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleges by name, city, or state..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="IIT">IIT</option>
          <option value="NIT">NIT</option>
          <option value="IIIT">IIIT</option>
          <option value="State">State</option>
          <option value="Private">Private</option>
          <option value="Deemed">Deemed</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.slice(0, 50).map((college, idx) => (
          <motion.div 
            key={college.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{college.type}</div>
                  <div className="text-sm text-slate-400 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {college.location.city}, {college.location.state}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSave(college.id)}
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                {saved.includes(college.id) ? <BookmarkCheck className="w-5 h-5 text-blue-400" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">{college.name}</h3>

            <div className="mt-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">NIRF Rank</div>
                  <div className="font-bold text-white">#{college.nirf_rank}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Avg Package</div>
                  <div className="font-bold text-emerald-400">₹{college.avg_package_lpa}L</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {college.courses_offered.map((course: string, i: number) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InternshipPortal({ user, setUser }: { user: any, setUser: any }) {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string[]>(user.saved_internships || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetch('/api/internships')
      .then(res => res.json())
      .then(data => {
        setInternships(data);
        setLoading(false);
      });
  }, []);

  const toggleSave = async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/user/save/internship/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setSaved(data.saved);
    setUser((prev: any) => ({ ...prev, saved_internships: data.saved }));
  };

  const filteredInternships = internships.filter(i => {
    const matchesSearch = i.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter ? i.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  if (loading) return <div className="py-12 text-center text-slate-400">Loading internships...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search internships by role, company, or domain..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="MNC">MNC</option>
          <option value="Startup">Startup</option>
          <option value="Government">Government</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map((internship, idx) => (
          <motion.div 
            key={internship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{internship.role}</h3>
                <div className="text-sm text-slate-400">{internship.company}</div>
              </div>
              <button 
                onClick={() => toggleSave(internship.id)}
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                {saved.includes(internship.id) ? <BookmarkCheck className="w-5 h-5 text-blue-400" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <span className="px-2.5 py-1 rounded-md bg-slate-950 text-xs font-medium text-slate-400 border border-slate-800">
                {internship.type}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                ₹{internship.stipend_monthly_inr.toLocaleString()}/mo
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-6 line-clamp-2">{internship.description}</p>

            <div className="mt-auto space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Skills</div>
                <div className="flex flex-wrap gap-2">
                  {internship.required_skills.map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Deadline: <span className="text-slate-300">{new Date(internship.deadline).toLocaleDateString()}</span>
                </div>
                <a 
                  href={internship.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Apply Now →
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
