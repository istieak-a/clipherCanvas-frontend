import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { generatePattern, EMOTIONS } from '../utils/patternGenerator';
import { useAuth } from '../context/AuthContext';

// Emotion config for chips
const EMOTION_CONFIG = {
  passion: { icon: '❤️', label: 'Passion', color: '#FF1744' },
  calm: { icon: '🌊', label: 'Calm', color: '#0084D1' },
  joy: { icon: '🌟', label: 'Joy', color: '#FFD600' },
  mystery: { icon: '🔮', label: 'Mystery', color: '#7C4DFF' },
  nature: { icon: '🌿', label: 'Nature', color: '#00C853' },
  serenity: { icon: '☮️', label: 'Serenity', color: '#00BCD4' }
};

// Generate mock data outside component to avoid re-computation
const generateMockSecrets = () => {
  const emotionKeys = EMOTIONS;
  return Array.from({ length: 20 }, (_, i) => {
    const emotion = emotionKeys[i % emotionKeys.length];
    // Use deterministic seeds based on index for consistent patterns
    const seed = 0.1 + (i * 0.04);
    return {
      id: i + 1,
      pattern: generatePattern(400, 280 + (i * 8), seed, emotion),
      author: `Anonymous${1000 + i * 123}`,
      authorInitial: String.fromCharCode(65 + (i % 26)),
      likes: 50 + i * 25,
      unlocks: 20 + i * 10,
      comments: 5 + i * 3,
      timestamp: `${(i % 23) + 1}h ago`,
      emotion
    };
  });
};

function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('recent');
  const [likedSecrets, setLikedSecrets] = useState(new Set());

  // Use useMemo to generate mock secrets only once
  const secrets = useMemo(() => generateMockSecrets(), []);

  const handleLike = (e, secretId) => {
    e.stopPropagation();
    setLikedSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(secretId)) {
        newSet.delete(secretId);
      } else {
        newSet.add(secretId);
      }
      return newSet;
    });
  };

  const breakpointColumns = {
    default: 3,
    1280: 2,
    768: 1
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084D1]"></div>
      </div>
    );
  }

  // If not authenticated, show login/signup prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Auth Landing Page */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Side - Branding & Info */}
          <div className="lg:w-1/2 bg-linear-to-br from-[#0084D1] to-[#0070B8] p-8 lg:p-16 flex flex-col justify-center">
            <div className="max-w-lg mx-auto lg:mx-0">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Whispher Pattern</h1>
              </div>

              {/* Tagline */}
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Where feelings hide in plain sight.
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Transform your emotions into beautiful encrypted art. Share anonymously, connect authentically.
              </p>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🔐</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Encrypted Expression</p>
                    <p className="text-blue-200 text-sm">Your secrets become art only you can decode</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎭</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Stay Anonymous</p>
                    <p className="text-blue-200 text-sm">Share freely without revealing your identity</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">💫</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Connect Through Art</p>
                    <p className="text-blue-200 text-sm">Discover and unlock others' hidden stories</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
                <div>
                  <p className="text-2xl font-bold text-white">10K+</p>
                  <p className="text-blue-200 text-sm">Secrets Shared</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">5K+</p>
                  <p className="text-blue-200 text-sm">Active Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-blue-200 text-sm">Anonymous</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-white">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
                <p className="text-gray-600">Join our community of anonymous artists</p>
              </div>

              {/* Auth Buttons */}
              <div className="space-y-4">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#0084D1] text-white rounded-xl font-semibold hover:bg-[#0070B8] transition-all shadow-lg hover:shadow-xl"
                >
                  <span>✨</span>
                  Create Account
                </Link>

                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  <span>👋</span>
                  Sign In
                </Link>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Preview the experience</span>
                </div>
              </div>

              {/* Sample Patterns Preview */}
              <div className="grid grid-cols-3 gap-3">
                {EMOTIONS.slice(0, 6).map((emotion, idx) => (
                  <div
                    key={emotion}
                    className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={generatePattern(150, 150, 0.5 + idx * 0.1, emotion)}
                        alt={emotion}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                          🔒
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-center text-gray-500 text-sm mt-6">
                Each pattern holds a hidden message. Sign up to start encoding yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Show Feed
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Navigation (Hidden on mobile) */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen border-r border-gray-200 bg-white p-6">
          <nav className="space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0084D1]/10 text-[#0084D1] font-medium"
            >
              <span className="text-xl">🏠</span>
              <span>Home</span>
            </Link>
            <Link
              to="/gallery"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">🔍</span>
              <span>Explore</span>
            </Link>
            <Link
              to="/create"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">✨</span>
              <span>Create</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">👤</span>
              <span>Profile</span>
            </Link>
          </nav>

          {/* Create CTA */}
          <div className="mt-8">
            <Link
              to="/create"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0084D1] text-white rounded-xl font-semibold hover:bg-[#0070B8] transition-colors shadow-lg"
            >
              <span className="text-lg">+</span>
              New Secret
            </Link>
          </div>

          {/* User Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.username || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">@{user?.username || 'anonymous'}</p>
              </div>
            </Link>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 min-w-0 border-r border-gray-200">
          {/* Feed Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
            <div className="px-4 lg:px-6 py-4">
              <h1 className="text-xl font-bold text-gray-900 mb-4">Feed</h1>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {['recent', 'popular', 'following'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                      activeFilter === filter
                        ? 'bg-[#0084D1] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feed Content */}
          <div className="p-4 lg:p-6">
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4 bg-clip-padding"
            >
              {secrets.map((secret) => (
                <article
                  key={secret.id}
                  className="mb-4 group cursor-pointer"
                  onClick={() => navigate(`/art/${secret.id}`)}
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    {/* Author Header */}
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {secret.authorInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{secret.author}</p>
                        <p className="text-xs text-gray-500">{secret.timestamp}</p>
                      </div>
                      {/* Emotion Chip */}
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${EMOTION_CONFIG[secret.emotion]?.color}15`,
                          color: EMOTION_CONFIG[secret.emotion]?.color 
                        }}
                      >
                        <span>{EMOTION_CONFIG[secret.emotion]?.icon}</span>
                        <span className="hidden sm:inline">{EMOTION_CONFIG[secret.emotion]?.label}</span>
                      </div>
                    </div>

                    {/* Pattern Image */}
                    <div className="relative">
                      <img
                        src={secret.pattern}
                        alt={`Secret by ${secret.author}`}
                        className="w-full h-auto"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center transform group-hover:scale-100 scale-90">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl">🔒</span>
                          </div>
                          <p className="text-white font-medium">Click to Unlock</p>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Bar */}
                    <div className="flex items-center justify-between p-4 border-t border-gray-50">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => handleLike(e, secret.id)}
                          className="flex items-center gap-1.5 text-gray-600 hover:text-[#FF1744] transition-colors"
                        >
                          <span className="text-xl">{likedSecrets.has(secret.id) ? '❤️' : '🤍'}</span>
                          <span className="text-sm font-medium">
                            {secret.likes + (likedSecrets.has(secret.id) ? 1 : 0)}
                          </span>
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-gray-600 hover:text-[#0084D1] transition-colors"
                        >
                          <span className="text-xl">🔓</span>
                          <span className="text-sm font-medium">{secret.unlocks}</span>
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-gray-600 hover:text-[#0084D1] transition-colors"
                        >
                          <span className="text-xl">💬</span>
                          <span className="text-sm font-medium">{secret.comments}</span>
                        </button>
                      </div>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <span className="text-xl">📤</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </Masonry>

            {/* Load More */}
            <div className="text-center py-8">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Load More
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Trending & Stats (Hidden on smaller screens) */}
        <aside className="hidden xl:block w-80 shrink-0 sticky top-0 h-screen p-6 overflow-y-auto">
          {/* Create Card */}
          <div className="bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-2xl p-6 text-white mb-6">
            <h3 className="font-bold text-lg mb-2">Share Your Secret</h3>
            <p className="text-blue-100 text-sm mb-4">Transform your thoughts into encrypted art</p>
            <Link
              to="/create"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#0084D1] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>✨</span>
              Create Now
            </Link>
          </div>

          {/* Trending Emotions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Trending Emotions</h3>
            <div className="space-y-3">
              {Object.entries(EMOTION_CONFIG).slice(0, 5).map(([key, emotion], idx) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <span className="text-xl">{emotion.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{emotion.label}</p>
                    <p className="text-xs text-gray-500">{200 + idx * 100} secrets</p>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Community</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-[#0084D1]">10K+</p>
                <p className="text-xs text-gray-600">Secrets</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-[#0084D1]">5K+</p>
                <p className="text-xs text-gray-600">Users</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-[#0084D1]">50K+</p>
                <p className="text-xs text-gray-600">Unlocks</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-[#0084D1]">100%</p>
                <p className="text-xs text-gray-600">Anonymous</p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <Link to="/about" className="hover:text-gray-700">About</Link>
              <span>·</span>
              <Link to="/contact" className="hover:text-gray-700">Contact</Link>
              <span>·</span>
              <span>Privacy</span>
              <span>·</span>
              <span>Terms</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">© 2026 Whispher Pattern</p>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-1 p-2 text-[#0084D1]">
            <span className="text-xl">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link to="/gallery" className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <span className="text-xl">🔍</span>
            <span className="text-xs font-medium">Explore</span>
          </Link>
          <Link to="/create" className="flex flex-col items-center gap-1 p-2">
            <div className="w-12 h-12 bg-[#0084D1] rounded-full flex items-center justify-center text-white text-2xl shadow-lg -mt-4">
              +
            </div>
          </Link>
          <Link to="/gallery" className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <span className="text-xl">❤️</span>
            <span className="text-xs font-medium">Activity</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <span className="text-xl">👤</span>
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Add padding for mobile bottom nav */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
}

export default Home;
