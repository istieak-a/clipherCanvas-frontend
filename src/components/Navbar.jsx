import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  // Don't show navbar on login/signup pages (they have their own branding)
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-xl flex items-center justify-center shadow-lg shadow-[#0084D1]/20">
              <span className="text-white text-lg">🎨</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Whispher Pattern</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors ${
                location.pathname === '/' ? 'text-[#0084D1] bg-blue-50' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors ${
                location.pathname === '/about' ? 'text-[#0084D1] bg-blue-50' : 'text-gray-600'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg font-medium hover:text-gray-900 hover:bg-gray-100 transition-colors ${
                location.pathname === '/contact' ? 'text-[#0084D1] bg-blue-50' : 'text-gray-600'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Side - Auth Section */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>👤</span>
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/create"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>✨</span>
                      <span>Create Secret</span>
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#0084D1] text-white font-medium hover:bg-[#0070B8] transition-all shadow-lg shadow-[#0084D1]/20 hover:shadow-xl hover:shadow-[#0084D1]/30"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
