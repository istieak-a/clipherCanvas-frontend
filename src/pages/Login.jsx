import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generatePattern, EMOTIONS } from '../utils/patternGenerator';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Generate multiple patterns for the background collage
  const patterns = useMemo(() => 
    EMOTIONS.slice(0, 6).map((emotion, i) => ({
      pattern: generatePattern(300, 300, 0.3 + i * 0.1, emotion),
      emotion
    })), []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Pattern Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0084D1] to-[#0070B8] relative overflow-hidden">
        {/* Floating Pattern Cards */}
        <div className="absolute inset-0 p-12 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 max-w-md transform -rotate-6">
            {patterns.slice(0, 4).map((item, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              >
                <img
                  src={item.pattern}
                  alt={`Pattern ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <span className="text-2xl font-bold text-white">Whispher Pattern</span>
          </Link>

          {/* Bottom Quote */}
          <div className="max-w-sm">
            <p className="text-2xl font-medium text-white/90 leading-relaxed">
              "Where every emotion becomes a masterpiece waiting to be discovered."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-xs text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-white/70 text-sm">Join 5,000+ artists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-xl flex items-center justify-center">
              <span className="text-lg">🎨</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Whispher Pattern</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Welcome back 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Sign in to continue your creative journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">⚠️</span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none bg-white"
                    placeholder="you@example.com"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    ✉️
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button type="button" className="text-sm text-[#0084D1] hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 pl-12 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none bg-white"
                    placeholder="Enter your password"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0084D1] text-white py-4 px-4 rounded-xl font-semibold hover:bg-[#0070B8] transition-all shadow-lg shadow-[#0084D1]/20 hover:shadow-xl hover:shadow-[#0084D1]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">New to Whispher Pattern?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/signup"
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#0084D1] hover:text-[#0084D1] transition-all"
            >
              <span>✨</span>
              <span>Create an account</span>
            </Link>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-8">
              By signing in, you agree to our{' '}
              <a href="#" className="text-[#0084D1] hover:underline">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-[#0084D1] hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
