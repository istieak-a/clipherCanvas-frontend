import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { Chip, Tabs, Tab } from '@mui/material';
import artService from '../utils/artService';
import { EMOTIONS, formatTimeAgo } from '../utils/mockData';
import UnlockModal from '../components/UnlockModal';

const Gallery = () => {
  const [artPosts, setArtPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);

  const fetchArt = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (selectedTab === 'all') {
        response = await artService.fetchAllArt();
      } else if (selectedTab === 'trending') {
        response = await artService.fetchTrendingArt();
      } else {
        response = await artService.searchByEmotion(selectedTab);
      }

      if (response.success) {
        setArtPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching art:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchArt();
  }, [fetchArt]);

  const handleUnlockClick = (art) => {
    setSelectedArt(art);
    setUnlockModalOpen(true);
  };

  const handleUnlockSuccess = () => {
    fetchArt(); // Refresh to show updated unlock status
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
              ? { ...post, isLiked: response.isLiked, likes: post.likes + (response.isLiked ? 1 : -1) }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const breakpointColumns = {
    default: 4,
    1536: 3,
    1024: 2,
    640: 1,
  };

  const emotionTabs = [
    { id: 'all', label: 'All', icon: '🎨' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    ...EMOTIONS.slice(0, 6), // Show first 6 emotions in tabs
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Art Gallery</h1>
          <p className="text-gray-600">Discover encrypted art from our community</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: '48px',
                textTransform: 'none',
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                color: '#0084D1',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#0084D1',
              },
            }}
          >
            {emotionTabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                }
              />
            ))}
          </Tabs>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084D1]"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && artPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No art found</h3>
            <p className="text-gray-600 mb-6">Be the first to create something amazing!</p>
            <Link
              to="/create"
              className="inline-block px-6 py-3 bg-[#0084D1] text-white rounded-lg font-medium hover:bg-[#0070B8] transition-colors"
            >
              Create Art
            </Link>
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && artPosts.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex -ml-6 w-auto"
            columnClassName="pl-6 bg-clip-padding"
          >
            {artPosts.map((art) => (
              <Link
                key={art.id}
                to={`/art/${art.id}`}
                className="mb-6 block group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {/* Art Image */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={art.pattern}
                      alt={`Art by ${art.userName}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      {!art.isUnlocked && (
                        <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <div className="bg-white rounded-full p-4 shadow-lg">
                            <svg
                              className="w-8 h-8 text-[#0084D1]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Emotion Badge */}
                    <div className="absolute top-3 right-3">
                      <Chip
                        label={art.emotionIcon}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(4px)',
                          fontSize: '1.2rem',
                        }}
                      />
                    </div>

                    {/* Unlock Status */}
                    {art.isUnlocked && (
                      <div className="absolute top-3 left-3">
                        <Chip
                          label="Unlocked"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(34, 197, 94, 0.9)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{art.userAvatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {art.userName}
                        </p>
                        <p className="text-xs text-gray-500">@{art.userUsername}</p>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimeAgo(art.createdAt)}</span>
                    </div>

                    {/* Emotion Tag */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        <span>{art.emotionIcon}</span>
                        <span>{art.emotionLabel}</span>
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t">
                      <button
                        onClick={(e) => handleLike(e, art.id)}
                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                          art.isLiked ? 'text-red-500' : ''
                        }`}
                      >
                        <span className="text-base">{art.isLiked ? '❤️' : '🤍'}</span>
                        <span className="font-medium">{art.likes}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnlockClick(art);
                        }}
                        className="flex items-center gap-1 hover:text-[#0084D1] transition-colors"
                      >
                        <span className="text-base">🔓</span>
                        <span className="font-medium">{art.unlocks}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <span className="text-base">💬</span>
                        <span className="font-medium">{art.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Masonry>
        )}
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
