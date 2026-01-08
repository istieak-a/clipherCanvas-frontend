import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import artService from '../utils/artService';
import UnlockModal from '../components/UnlockModal';

// Emotion config
const EMOTION_CONFIG = {
  passion: { icon: '❤️', label: 'Passion', color: '#FF1744' },
  calm: { icon: '🌊', label: 'Calm', color: '#0084D1' },
  joy: { icon: '🌟', label: 'Joy', color: '#FFD600' },
  mystery: { icon: '🔮', label: 'Mystery', color: '#7C4DFF' },
  nature: { icon: '🌿', label: 'Nature', color: '#00C853' },
  serenity: { icon: '☮️', label: 'Serenity', color: '#00BCD4' }
};

// Helper to format time ago
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const ArtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchArt = useCallback(async () => {
    setLoading(true);
    try {
      const response = await artService.fetchArtById(id);
      if (response.success) {
        setArt(response.data);
      } else {
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
    fetchArt();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    const text = `Check out this encrypted art on Whispher Pattern!`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleDownload = () => {
    if (art?.pattern) {
      const link = document.createElement('a');
      link.href = art.pattern;
      link.download = `Whispher Pattern-${art.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#0084D1]"></div>
          <p className="text-gray-500 text-sm">Loading art...</p>
        </div>
      </div>
    );
  }

  if (!art) return null;

  const emotion = EMOTION_CONFIG[art.emotion] || { icon: '🎨', label: 'Art', color: '#0084D1' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/gallery')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0084D1] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Gallery</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Art Display (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main Art Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Creator Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white font-bold">
                    {art.userName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/profile/${art.userId}`}
                      className="font-semibold text-gray-900 hover:text-[#0084D1] transition-colors"
                    >
                      {art.userName}
                    </Link>
                    <p className="text-sm text-gray-500">{formatTimeAgo(art.createdAt)}</p>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${emotion.color}15`,
                      color: emotion.color 
                    }}
                  >
                    {emotion.icon} {emotion.label}
                  </span>
                </div>
              </div>

              {/* Pattern Image */}
              <div className="relative">
                <img
                  src={art.pattern}
                  alt={`Art by ${art.userName}`}
                  className="w-full aspect-square object-cover"
                />
                
                {/* Lock Overlay */}
                {!art.isUnlocked && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-white rounded-full p-6 shadow-2xl">
                      <span className="text-5xl">🔒</span>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                {art.isUnlocked && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg">
                      ✓ Unlocked
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-lg transition-colors ${
                      art.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <span className="text-2xl">{art.isLiked ? '❤️' : '🤍'}</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="text-gray-600 hover:text-[#0084D1] transition-colors"
                  >
                    <span className="text-2xl">🔗</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="text-gray-600 hover:text-[#0084D1] transition-colors"
                  >
                    <span className="text-2xl">📤</span>
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-gray-900">{art.likes} likes</span>
                  <span className="text-gray-600">{art.unlocks} unlocks</span>
                </div>

                {/* Copied Toast */}
                {copied && (
                  <div className="mt-2 p-2 bg-green-50 text-green-600 text-sm rounded-lg text-center">
                    ✓ Link copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Unlock/Message Card */}
            {art.isUnlocked ? (
              <div className="bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📜</span>
                  <h2 className="font-semibold uppercase tracking-wide text-sm opacity-90">Secret Message</h2>
                </div>
                <p className="text-lg leading-relaxed">{art.message}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🔐</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Locked</h3>
                  <p className="text-gray-600 mb-6">
                    Enter the secret key to reveal the hidden message
                  </p>
                  <button
                    onClick={() => setUnlockModalOpen(true)}
                    className="w-full py-3 bg-[#0084D1] text-white rounded-xl font-medium hover:bg-[#0070B8] transition-colors shadow-lg shadow-[#0084D1]/20"
                  >
                    🔓 Unlock Message
                  </button>
                </div>
              </div>
            )}

            {/* Hint Card */}
            {art.hint && art.hint !== 'No hint provided' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">💡</span>
                  <h2 className="font-semibold text-gray-900">Hint</h2>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-amber-900 italic">&quot;{art.hint}&quot;</p>
                </div>
                {!art.isUnlocked && (
                  <p className="text-xs text-gray-500 mt-3">
                    Use this hint to guess the secret key
                  </p>
                )}
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{art.likes}</p>
                  <p className="text-xs text-gray-600">Likes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{art.unlocks}</p>
                  <p className="text-xs text-gray-600">Unlocks</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{art.comments || 0}</p>
                  <p className="text-xs text-gray-600">Comments</p>
                </div>
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Share</h2>
              <div className="flex gap-3">
                <button 
                  onClick={handleCopyLink}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-center group"
                >
                  <span className="text-2xl group-hover:scale-110 inline-block transition-transform">🔗</span>
                  <p className="text-xs text-gray-600 mt-1">Copy</p>
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-center group"
                >
                  <span className="text-2xl group-hover:scale-110 inline-block transition-transform">🐦</span>
                  <p className="text-xs text-gray-600 mt-1">Tweet</p>
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-center group"
                >
                  <span className="text-2xl group-hover:scale-110 inline-block transition-transform">💾</span>
                  <p className="text-xs text-gray-600 mt-1">Save</p>
                </button>
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
