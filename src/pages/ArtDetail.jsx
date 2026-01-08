import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Chip, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import artService from '../utils/artService';
import { formatTimeAgo, getEmotionById } from '../utils/mockData';
import UnlockModal from '../components/UnlockModal';

const ArtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  const fetchArt = useCallback(async () => {
    setLoading(true);
    try {
      const response = await artService.fetchArtById(id);
      if (response.success) {
        setArt(response.data);
      } else {
        // Art not found, redirect to gallery
        navigate('/gallery');
      }
    } catch (error) {
      console.error('Error fetching art:', error);
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchArt();
  }, [fetchArt]);

  const handleLike = async () => {
    try {
      const response = await artService.toggleLikeArt(art.id);
      if (response.success) {
        setArt({
          ...art,
          isLiked: response.isLiked,
          likes: response.likes,
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleUnlockSuccess = () => {
    fetchArt(); // Refresh to show unlocked state
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084D1]"></div>
      </div>
    );
  }

  if (!art) {
    return null;
  }

  const emotion = getEmotionById(art.emotion);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/gallery')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0084D1] mb-6 transition-colors"
        >
          <ArrowBackIcon />
          <span>Back to Gallery</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Art Display */}
          <div className="space-y-6">
            {/* Main Art Image */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-4/3 relative">
                <img
                  src={art.pattern}
                  alt={`Art by ${art.userName}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay for locked art */}
                {!art.isUnlocked && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-white rounded-full p-6 shadow-2xl">
                      <svg
                        className="w-12 h-12 text-[#0084D1]"
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

                {/* Status Badge */}
                {art.isUnlocked && (
                  <div className="absolute top-4 left-4">
                    <Chip
                      label="Unlocked"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(34, 197, 94, 0.9)',
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(4px)',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-4">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    art.isLiked
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{art.isLiked ? '❤️' : '🤍'}</span>
                  <span>{art.likes} Likes</span>
                </button>

                {!art.isUnlocked && (
                  <button
                    onClick={() => setUnlockModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0084D1] text-white rounded-lg font-medium hover:bg-[#0070B8] transition-colors"
                  >
                    <span className="text-xl">🔓</span>
                    <span>Unlock Message</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{art.unlocks}</p>
                  <p className="text-sm text-gray-600">Unlocks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{art.comments}</p>
                  <p className="text-sm text-gray-600">Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Creator Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Created By</h2>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{art.userAvatar}</span>
                <div className="flex-1">
                  <Link
                    to={`/profile/${art.userId}`}
                    className="text-xl font-bold text-gray-900 hover:text-[#0084D1] transition-colors"
                  >
                    {art.userName}
                  </Link>
                  <p className="text-gray-600">@{art.userUsername}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatTimeAgo(art.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Emotion */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Emotion</h2>
              <div
                className="p-4 rounded-lg flex items-center gap-4"
                style={{ backgroundColor: `${emotion?.color}20` }}
              >
                <span className="text-4xl">{art.emotionIcon}</span>
                <div>
                  <p className="text-xl font-semibold text-gray-900">{art.emotionLabel}</p>
                  <p className="text-sm text-gray-600">Artistic expression of {art.emotionLabel.toLowerCase()}</p>
                </div>
              </div>
            </div>

            {/* Hint */}
            {art.hint && art.hint !== 'No hint provided' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                  💡 Unlock Hint
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 italic text-lg">{art.hint}</p>
                </div>
                {!art.isUnlocked && (
                  <p className="text-sm text-gray-500 mt-3">
                    Use this hint to guess the secret key and unlock the hidden message
                  </p>
                )}
              </div>
            )}

            {/* Unlocked Message */}
            {art.isUnlocked && (
              <div className="bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📜</span>
                  <h2 className="text-sm font-semibold uppercase opacity-90">Secret Message</h2>
                </div>
                <p className="text-lg leading-relaxed">{art.message}</p>
              </div>
            )}

            {/* Locked Message */}
            {!art.isUnlocked && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-gray-300">
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🔐</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Message Locked
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Enter the secret key to reveal the hidden message
                  </p>
                  <button
                    onClick={() => setUnlockModalOpen(true)}
                    className="px-6 py-3 bg-[#0084D1] text-white rounded-lg font-medium hover:bg-[#0070B8] transition-colors"
                  >
                    Unlock Now
                  </button>
                </div>
              </div>
            )}

            {/* Share */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Share</h2>
              <div className="flex gap-3">
                <Tooltip title="Copy Link">
                  <button className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-2xl">
                    🔗
                  </button>
                </Tooltip>
                <Tooltip title="Share on Twitter">
                  <button className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-2xl">
                    🐦
                  </button>
                </Tooltip>
                <Tooltip title="Download">
                  <button className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-2xl">
                    💾
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unlock Modal */}
      <UnlockModal
        open={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        art={art}
        onSuccess={handleUnlockSuccess}
      />
    </div>
  );
};

export default ArtDetail;
