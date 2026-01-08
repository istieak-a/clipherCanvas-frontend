import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generatePattern, EMOTIONS } from '../utils/patternGenerator';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Generate patterns for the background
  const patterns = useMemo(() => 
    EMOTIONS.map((emotion, i) => ({
      pattern: generatePattern(250, 250, 0.2 + i * 0.12, emotion),
      emotion
    })), []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({ 
        username, 
        email, 
        password,
        firstName,
        lastName
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Pattern Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0084D1] to-[#0070B8] relative overflow-hidden">
        {/* Animated Pattern Grid */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="grid grid-cols-3 gap-3 max-w-lg transform rotate-6 opacity-80">
            {patterns.map((item, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden shadow-xl"
                style={{
                  transform: `translateY(${i % 2 === 0 ? '-10px' : '10px'})`
                }}
              >
                <img
                  src={item.pattern}
                  alt={item.emotion}
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
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">
              Transform your emotions into art
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Join thousands of artists who share their stories through encrypted patterns.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-3 mt-6">
              {['🔐 Encrypted', '🎭 Anonymous', '✨ Creative'].map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
                >
                  {feature}
                </span>
              ))}
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
          <Link to="/login" className="text-[#0084D1] font-medium">
            Sign in
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Create your account ✨
              </h1>
              <p className="text-gray-600 text-lg">
                Start encoding your emotions in just a few steps
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                step >= 1 ? 'bg-[#0084D1] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-[#0084D1]' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                step >= 2 ? 'bg-[#0084D1] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">⚠️</span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <>
                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none bg-white"
                        placeholder="your_artist_name"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        👤
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">This will be your public identity</p>
                  </div>

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

                  {/* Name Fields (Optional) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First name <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none bg-white"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last name <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none bg-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!username || !email}
                    className="w-full bg-[#0084D1] text-white py-4 px-4 rounded-xl font-semibold hover:bg-[#0070B8] transition-all shadow-lg shadow-[#0084D1]/20 hover:shadow-xl hover:shadow-[#0084D1]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <span>→</span>
                  </button>
                </>
              )}

              {/* Step 2: Password */}
              {step === 2 && (
                <>
                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
                  >
                    <span>←</span>
                    <span>Back</span>
                  </button>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Create a password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 pl-12 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none bg-white"
                        placeholder="Create a strong password"
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
                    
                    {/* Password Strength Indicators */}
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded ${
                              password.length >= i * 3 ? 'bg-[#0084D1]' : 'bg-gray-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Use 8+ characters with letters, numbers & symbols
                      </p>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <p className="text-sm text-gray-600">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-[#0084D1] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#0084D1] hover:underline">Privacy Policy</a>
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !password}
                    className="w-full bg-[#0084D1] text-white py-4 px-4 rounded-xl font-semibold hover:bg-[#0070B8] transition-all shadow-lg shadow-[#0084D1]/20 hover:shadow-xl hover:shadow-[#0084D1]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create account</span>
                        <span>✨</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#0084D1] hover:text-[#0084D1] transition-all"
            >
              <span>👋</span>
              <span>Sign in instead</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
