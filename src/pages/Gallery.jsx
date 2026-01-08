import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import artService from '../utils/artService';
import { EMOTIONS } from '../utils/mockData';
import UnlockModal from '../components/UnlockModal';

// Emotion config matching Home page
const EMOTION_CONFIG = {
  passion: { icon: '❤️', label: 'Passion', color: '#FF1744' },
  calm: { icon: '🌊', label: 'Calm', color: '#0084D1' },
  joy: { icon: '🌟', label: 'Joy', color: '#FFD600' },
  mystery: { icon: '🔮', label: 'Mystery', color: '#7C4DFF' },
  nature: { icon: '🌿', label: 'Nature', color: '#00C853' },
  serenity: { icon: '☮️', label: 'Serenity', color: '#00BCD4' }
};

const Gallery = () => {
  const navigate = useNavigate();
  const [artPosts, setArtPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const fetchArt = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (selectedFilter === 'all') {
        response = await artService.fetchAllArt();
      } else if (selectedFilter === 'trending') {
        response = await artService.fetchTrendingArt();
      } else {
        response = await artService.searchByEmotion(selectedFilter);
      }

      if (response.success) {
        setArtPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching art:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    fetchArt();
  }, [fetchArt]);

  const handleUnlockClick = (e, art) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedArt(art);
    setUnlockModalOpen(true);
  };

  const handleUnlockSuccess = () => {
    fetchArt();
  };

  const handleLike = async (e, artId) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await artService.toggleLikeArt(artId);
      if (response.success) {
        setArtPosts(posts =>
          posts.map(post =>
            post.id === artId
              ? { ...post, isLiked: response.isLiked, likes: response.likes }
              : post
          )
        );
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (response.isLiked) {
            newSet.add(artId);
          } else {
            newSet.delete(artId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const breakpointColumns = {
    default: 3,
    1280: 2,
    768: 1,
  };

  const filterTabs = [
    { id: 'all', label: 'All', icon: '🎨' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    ...EMOTIONS.map(e => ({ id: e.id, label: e.label, icon: e.icon })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Filters (Hidden on mobile) */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen border-r border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Explore</h2>
          <nav className="space-y-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  selectedFilter === tab.id
                    ? 'bg-[#0084D1]/10 text-[#0084D1] font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Create CTA */}
          <div className="mt-8">
            <Link
              to="/create"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0084D1] text-white rounded-xl font-semibold hover:bg-[#0070B8] transition-colors shadow-lg"
            >
              <span className="text-lg">+</span>
              Create Art
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
            <div className="px-4 lg:px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gallery</h1>
                  <p className="text-sm text-gray-500">Discover encrypted art from the community</p>
                </div>
              </div>
              
              {/* Mobile Filter Tabs */}
              <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {filterTabs.slice(0, 6).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedFilter === tab.id
                        ? 'bg-[#0084D1] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#0084D1]"></div>
                <p className="text-gray-500 text-sm">Loading artwork...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && artPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No art found</h3>
              <p className="text-gray-600 mb-6 text-center max-w-sm">
                {selectedFilter === 'all' 
                  ? 'Be the first to create something amazing!'
                  : `No art with ${selectedFilter} emotion yet. Be the first!`}
              </p>
              <Link
                to="/create"
                className="px-6 py-3 bg-[#0084D1] text-white rounded-xl font-medium hover:bg-[#0070B8] transition-colors shadow-lg"
              >
                Create Art
              </Link>
            </div>
          )}

          {/* Art Grid */}
          {!loading && artPosts.length > 0 && (
            <div className="p-4 lg:p-6">
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
              >
                {artPosts.map((art) => (
                  <article
                    key={art.id}
                    className="mb-4 group cursor-pointer"
                    onClick={() => navigate(`/art/${art.id}`)}
                  >
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      {/* Author Header */}
                      <div className="flex items-center gap-3 p-4">
                        <div className="w-10 h-10 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {art.userName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{art.userName}</p>
                          <p className="text-xs text-gray-500">@{art.userUsername}</p>
                        </div>
                        {/* Emotion Chip */}
                        <div
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${EMOTION_CONFIG[art.emotion]?.color}15`,
                            color: EMOTION_CONFIG[art.emotion]?.color 
                          }}
                        >
                          <span>{art.emotionIcon}</span>
                          <span className="hidden sm:inline">{art.emotionLabel}</span>
                        </div>
                      </div>

                      {/* Pattern Image */}
                      <div className="relative">
                        <img
                          src={art.pattern}
                          alt={`Art by ${art.userName}`}
                          className="w-full h-auto"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center transform group-hover:scale-100 scale-90">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-3xl">{art.isUnlocked ? '🔓' : '🔒'}</span>
                            </div>
                            <p className="text-white font-medium">
                              {art.isUnlocked ? 'View Message' : 'Click to Unlock'}
                            </p>
                          </div>
                        </div>

                        {/* Unlock Status Badge */}
                        {art.isUnlocked && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full">
                              Unlocked
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Timestamp & Hint */}
                      {art.hint && (
                        <div className="px-4 pt-3">
                          <p className="text-xs text-gray-500 italic truncate">💡 {art.hint}</p>
                        </div>
                      )}

                      {/* Engagement Bar */}
                      <div className="flex items-center justify-between p-4 pt-3">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => handleLike(e, art.id)}
                            className="flex items-center gap-1.5 text-gray-600 hover:text-[#FF1744] transition-colors"
                          >
                            <span className="text-xl">{art.isLiked || likedPosts.has(art.id) ? '❤️' : '🤍'}</span>
                            <span className="text-sm font-medium">{art.likes}</span>
                          </button>
                          <button
                            onClick={(e) => handleUnlockClick(e, art)}
                            className="flex items-center gap-1.5 text-gray-600 hover:text-[#0084D1] transition-colors"
                          >
                            <span className="text-xl">🔓</span>
                            <span className="text-sm font-medium">{art.unlocks}</span>
                          </button>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <span className="text-xl">💬</span>
                            <span className="text-sm font-medium">{art.comments}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{formatTimeAgo(art.createdAt)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </Masonry>
            </div>
          )}
        </main>

        {/* Right Sidebar - Stats (Hidden on smaller screens) */}
        <aside className="hidden xl:block w-80 shrink-0 sticky top-0 h-screen p-6 overflow-y-auto">
          {/* Emotion Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Emotion Categories</h3>
            <div className="space-y-3">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedFilter(emotion.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    selectedFilter === emotion.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{emotion.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 text-sm">{emotion.label}</p>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Create */}
          <div className="bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Share Your Secret</h3>
            <p className="text-blue-100 text-sm mb-4">Transform your emotions into encrypted art</p>
            <Link
              to="/create"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#0084D1] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>✨</span>
              Create Now
            </Link>
          </div>
        </aside>
      </div>

      {/* Unlock Modal */}
      <UnlockModal
        open={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        art={selectedArt}
        onSuccess={handleUnlockSuccess}
      />
    </div>
  );
};

export default Gallery;
