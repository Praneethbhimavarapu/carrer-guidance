import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Post10th from './pages/Post10th';
import Post12th from './pages/Post12th';
import BranchDetail from './pages/BranchDetail';
import BTechHub from './pages/BTechHub';
import Dashboard from './pages/Dashboard';

// Components
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
        <Navbar user={user} setUser={setUser} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login setUser={setUser} />} />
            
            {/* Protected Routes */}
            <Route path="/onboarding" element={user ? <Onboarding user={user} setUser={setUser} /> : <Navigate to="/auth/login" />} />
            <Route path="/post-10th" element={user ? <Post10th user={user} setUser={setUser} /> : <Navigate to="/auth/login" />} />
            <Route path="/post-12th" element={user ? <Post12th user={user} /> : <Navigate to="/auth/login" />} />
            <Route path="/post-12th/:branchId/:specId" element={user ? <BranchDetail user={user} setUser={setUser} /> : <Navigate to="/auth/login" />} />
            <Route path="/btech-hub/*" element={user ? <BTechHub user={user} setUser={setUser} /> : <Navigate to="/auth/login" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
