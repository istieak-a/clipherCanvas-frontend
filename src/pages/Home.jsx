import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { useAuth } from '../context/AuthContext';
import { artService } from '../utils/artService';
import UnlockModal from '../components/UnlockModal';

// Emotion config for chips
const EMOTION_CONFIG = {
  passion: { icon: '❤️', label: 'Passion', color: '#FF1744' },
  calm: { icon: '🌊', label: 'Calm', color: '#0084D1' },
  joy: { icon: '🌟', label: 'Joy', color: '#FFD600' },
  mystery: { icon: '🔮', label: 'Mystery', color: '#7C4DFF' },
  nature: { icon: '🌿', label: 'Nature', color: '#00C853' },
  serenity: { icon: '☮️', label: 'Serenity', color: '#00BCD4' }
};

// Format time ago
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

function Home() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('recent');
  const [artPosts, setArtPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [selectedArt, setSelectedArt] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Fetch art posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const result = await artService.fetchAllArt();
      if (result.success) {
        setArtPosts(result.data);
      } else {
        console.error('Failed to fetch posts:', result.error);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLike = async (e, artId) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artId)) {
        newSet.delete(artId);
      } else {
        newSet.add(artId);
      }
      return newSet;
    });

    // API call would go here
    try {
      // await artService.likeArt(artId);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleArtClick = (art) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedArt(art);
    setShowUnlockModal(true);
  };

  const breakpointColumns = {
    default: 3,
    1280: 2,
    768: 1
  };

  // Show loading state
  if (loading || loadingPosts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084D1]"></div>
      </div>
    );
  }

  // Show Landing Page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="text-center lg:text-left space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">5,000+ Active Users</span>
                </div>

                {/* Main Heading */}
                <div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                    Your Secrets,
                    <br />
                    <span className="bg-gradient-to-r from-[#0084D1] via-[#00BCD4] to-[#7C4DFF] bg-clip-text text-transparent">
                      Transformed into Art
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Share your deepest thoughts anonymously through beautiful encrypted patterns. Connect with others who feel the same.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/signup"
                    className="group relative px-8 py-4 bg-gradient-to-r from-[#0084D1] to-[#0070B8] text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Free
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0070B8] to-[#005A9C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No sign-up required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>100% Anonymous</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>End-to-end encrypted</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Interactive Visual */}
              <div className="relative">
                <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { emoji: '❤️', color: '#FF1744', label: 'Passion' },
                      { emoji: '🌊', color: '#0084D1', label: 'Calm' },
                      { emoji: '🌟', color: '#FFD600', label: 'Joy' },
                      { emoji: '🔮', color: '#7C4DFF', label: 'Mystery' },
                      { emoji: '🌿', color: '#00C853', label: 'Nature' },
                      { emoji: '☮️', color: '#00BCD4', label: 'Peace' },
                      { emoji: '🌸', color: '#E91E63', label: 'Love' },
                      { emoji: '⚡', color: '#FFC107', label: 'Energy' },
                      { emoji: '🌙', color: '#9C27B0', label: 'Dream' }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-2xl flex items-center justify-center text-4xl transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl"
                        style={{ 
                          backgroundColor: `${item.color}15`,
                          animation: `float ${3 + idx * 0.5}s ease-in-out infinite`
                        }}
                      >
                        <span className="relative z-10">{item.emoji}</span>
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ backgroundColor: `${item.color}30` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-bounce">
                    <p className="text-sm font-semibold text-gray-700">🔒 Encrypted</p>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                    <p className="text-sm font-semibold text-gray-700">✨ Beautiful</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Whisper Pattern?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Express yourself freely in a space designed for authentic, anonymous sharing
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🔐',
                  title: 'Complete Anonymity',
                  description: 'No personal information required. Your identity stays hidden forever. Share without fear of judgment.',
                  gradient: 'from-red-500 to-pink-500'
                },
                {
                  icon: '🎨',
                  title: 'Art-Based Encryption',
                  description: 'Your secrets become beautiful visual patterns. Others must unlock the art to read your message.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: '💫',
                  title: 'Emotional Connection',
                  description: 'Connect with people who truly understand. Find community through shared feelings and experiences.',
                  gradient: 'from-purple-500 to-indigo-500'
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Three simple steps to share your story
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-1 bg-gradient-to-r from-[#0084D1] to-[#7C4DFF] opacity-20"></div>

              {[
                {
                  step: '01',
                  title: 'Write Your Secret',
                  description: 'Share your thoughts, feelings, or confessions. Choose an emotion that matches your mood.',
                  icon: '✍️'
                },
                {
                  step: '02',
                  title: 'Generate Pattern',
                  description: 'Our AI transforms your text into a unique, beautiful encrypted pattern that represents your emotion.',
                  icon: '🎨'
                },
                {
                  step: '03',
                  title: 'Share & Connect',
                  description: 'Post to the community. Others unlock your art to reveal the message and connect with you.',
                  icon: '🌍'
                }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#0084D1] to-[#7C4DFF] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {item.step}
                      </div>
                      <span className="text-5xl">{item.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#0084D1]/20 to-[#7C4DFF]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#00BCD4]/20 to-[#0084D1]/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Join Our Growing Community</h2>
              <p className="text-xl text-gray-600">Trusted by thousands worldwide</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '5,000+', label: 'Active Users', icon: '👥', color: '#0084D1' },
                { value: '50,000+', label: 'Secrets Shared', icon: '🎨', color: '#7C4DFF' },
                { value: '100,000+', label: 'Unlocks', icon: '🔓', color: '#00BCD4' },
                { value: '100%', label: 'Anonymous', icon: '🔒', color: '#00C853' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-gray-600 text-base font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                What People Say
              </h2>
              <p className="text-xl text-gray-600">Anonymous voices from our community</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Finally, a place where I can express myself without fear. The art format makes it beautiful and meaningful.",
                  emotion: "❤️",
                  color: "#FF1744"
                },
                {
                  quote: "I've never felt so heard. Unlocking others' secrets made me realize I'm not alone in what I'm feeling.",
                  emotion: "🌊",
                  color: "#0084D1"
                },
                {
                  quote: "The encryption through art is genius. It's like a diary that's public yet private at the same time.",
                  emotion: "🔮",
                  color: "#7C4DFF"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                      style={{ backgroundColor: `${testimonial.color}15` }}
                    >
                      {testimonial.emotion}
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-[#FFD600] text-lg">⭐</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">"{testimonial.quote}"</p>
                  <p className="text-gray-500 text-sm font-medium">- Anonymous User</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-24 bg-gradient-to-br from-[#0084D1] via-[#00BCD4] to-[#7C4DFF] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join our community of anonymous voices. Your secrets are safe with us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="group px-10 py-5 bg-white text-[#0084D1] rounded-2xl font-bold text-lg shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Sharing Anonymously
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link
                to="/login"
                className="px-10 py-5 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 border-2 border-white/40"
              >
                Sign In
              </Link>
            </div>

            <p className="text-white/80 text-sm mt-8">
              No credit card required • 100% free • Forever anonymous
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  // Show Feed for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        {/* Main Feed */}
        <main className="flex-1 min-w-0 mx-auto max-w-4xl">
          {/* Feed Header */}
          <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
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
          <div className="p-4 lg:px-6">
            {artPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No posts yet. Be the first to share!</p>
                {isAuthenticated && (
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0084D1] text-white rounded-xl font-semibold hover:bg-[#0070B8] transition-colors"
                  >
                    <span>✨</span>
                    Create Secret
                  </Link>
                )}
              </div>
            ) : (
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
              >
                {artPosts.map((art) => (
                  <article
                    key={art.id}
                    className="mb-4 group cursor-pointer"
                    onClick={() => handleArtClick(art)}
                  >
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      {/* Author Header */}
                      <div className="flex items-center gap-3 p-4">
                        <div className="w-10 h-10 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {art.userName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{art.userName || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(art.createdAt)}</p>
                        </div>
                        {/* Emotion Chip */}
                        <div
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${EMOTION_CONFIG[art.emotion]?.color}15`,
                            color: EMOTION_CONFIG[art.emotion]?.color 
                          }}
                        >
                          <span>{EMOTION_CONFIG[art.emotion]?.icon}</span>
                          <span className="hidden sm:inline">{EMOTION_CONFIG[art.emotion]?.label}</span>
                        </div>
                      </div>

                      {/* Pattern Image */}
                      <div className="relative">
                        <img
                          src={art.pattern}
                          alt={`Secret by ${art.userName}`}
                          className="w-full h-auto"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center transform group-hover:scale-100 scale-90">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-3xl">🔒</span>
                            </div>
                            <p className="text-white font-medium">
                              {isAuthenticated ? 'Click to Unlock' : 'Login to Unlock'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Engagement Bar */}
                      <div className="flex items-center justify-between p-4 border-t border-gray-50">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => handleLike(e, art.id)}
                            className="flex items-center gap-1.5 text-gray-600 hover:text-[#FF1744] transition-colors"
                          >
                            <span className="text-xl">{likedPosts.has(art.id) ? '❤️' : '🤍'}</span>
                            <span className="text-sm font-medium">
                              {art.likes + (likedPosts.has(art.id) ? 1 : 0)}
                            </span>
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-gray-600 hover:text-[#0084D1] transition-colors"
                          >
                            <span className="text-xl">🔓</span>
                            <span className="text-sm font-medium">{art.unlocks}</span>
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-gray-600 hover:text-[#0084D1] transition-colors"
                          >
                            <span className="text-xl">💬</span>
                            <span className="text-sm font-medium">{art.comments}</span>
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
            )}
          </div>
        </main>

        {/* Right Sidebar - Trending & Stats (Hidden on smaller screens) */}
        <aside className="hidden xl:block w-80 shrink-0 sticky top-16 h-[calc(100vh-4rem)] p-6 overflow-y-auto">
          {/* Create Card */}
          {isAuthenticated && (
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
          )}

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
                <p className="text-xl font-bold text-[#0084D1]">{artPosts.length}</p>
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

      {/* Unlock Modal */}
      <UnlockModal
        open={showUnlockModal}
        art={selectedArt}
        onClose={() => {
          setShowUnlockModal(false);
          setSelectedArt(null);
        }}
        onSuccess={fetchPosts}
      />

      {/* Add padding for mobile if needed */}
      <div className="h-6"></div>
    </div>
  );
}

export default Home;
