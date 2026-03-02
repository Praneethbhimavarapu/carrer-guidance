import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, LogOut } from 'lucide-react';

export default function Navbar({ user, setUser }: { user: any, setUser: any }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Compass className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              PathFinder
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-slate-300">
                  <Link to="/post-10th" className="hover:text-white transition-colors">Phase 1</Link>
                  <Link to="/post-12th" className="hover:text-white transition-colors">Phase 2</Link>
                  <Link to="/btech-hub" className="hover:text-white transition-colors">Phase 3</Link>
                </div>
                <div className="h-6 w-px bg-slate-800 mx-2"></div>
                <Link to="/dashboard" className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link to="/auth/login" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
