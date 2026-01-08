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

  // Show Feed for all users (authenticated or not)
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
      {showUnlockModal && selectedArt && (
        <UnlockModal
          art={selectedArt}
          onClose={() => {
            setShowUnlockModal(false);
            setSelectedArt(null);
          }}
        />
      )}

      {/* Add padding for mobile if needed */}
      <div className="h-6"></div>
    </div>
  );
}

export default Home;
