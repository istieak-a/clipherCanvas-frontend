import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/authService';
import artService from '../utils/artService';

// Emotion config
const EMOTION_CONFIG = {
  passion: { icon: '❤️', label: 'Passion', color: '#FF1744' },
  calm: { icon: '🌊', label: 'Calm', color: '#0084D1' },
  joy: { icon: '🌟', label: 'Joy', color: '#FFD600' },
  mystery: { icon: '🔮', label: 'Mystery', color: '#7C4DFF' },
  nature: { icon: '🌿', label: 'Nature', color: '#00C853' },
  serenity: { icon: '☮️', label: 'Serenity', color: '#00BCD4' }
};

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userArt, setUserArt] = useState([]);
  const [artLoading, setArtLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const fetchUserArt = useCallback(async () => {
    if (!user?._id) return;
    setArtLoading(true);
    try {
      const response = await artService.fetchUserArt(user._id);
      if (response.success) {
        setUserArt(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user art:', err);
    } finally {
      setArtLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchUserArt();
  }, [fetchUserArt]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await updateProfile(formData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      avatar: user.avatar || ''
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const breakpointColumns = {
    default: 3,
    1280: 2,
    768: 1,
  };

  if (!user) return null;

  const stats = {
    posts: userArt.length,
    likes: userArt.reduce((sum, art) => sum + (art.likes || 0), 0),
    unlocks: userArt.reduce((sum, art) => sum + (art.unlocks || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-[#0084D1] to-[#0070B8] rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-xl shadow-[#0084D1]/20">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 justify-center sm:justify-start mb-3">
                <div className="text-center sm:text-left">
                  <span className="font-bold text-gray-900">{stats.posts}</span>
                  <span className="text-gray-600 ml-1">posts</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-bold text-gray-900">{stats.likes}</span>
                  <span className="text-gray-600 ml-1">likes</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-bold text-gray-900">{stats.unlocks}</span>
                  <span className="text-gray-600 ml-1">unlocks</span>
                </div>
              </div>

              {/* Name & Info */}
              <div className="text-gray-600 text-sm">
                {user.firstName || user.lastName ? (
                  <p className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                ) : null}
                <p>{user.email}</p>
                <p className="text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8 justify-center">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-[#0084D1] text-[#0084D1]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🎨</span>
                <span>POSTS</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#0084D1] text-[#0084D1]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>⚙️</span>
                <span>SETTINGS</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <span className="text-red-500">⚠️</span>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
            <span className="text-green-500">✓</span>
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <>
            {artLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#0084D1]"></div>
                  <p className="text-gray-500 text-sm">Loading your art...</p>
                </div>
              </div>
            ) : userArt.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No art yet</h3>
                <p className="text-gray-600 mb-6 text-center max-w-sm">
                  Start sharing your encrypted secrets with the world
                </p>
                <Link
                  to="/create"
                  className="px-6 py-3 bg-[#0084D1] text-white rounded-xl font-medium hover:bg-[#0070B8] transition-colors shadow-lg"
                >
                  Create Your First Art
                </Link>
              </div>
            ) : (
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
              >
                {userArt.map((art) => (
                  <Link
                    key={art.id}
                    to={`/art/${art.id}`}
                    className="mb-4 block group"
                  >
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      {/* Pattern Image */}
                      <div className="relative aspect-square">
                        <img
                          src={art.pattern}
                          alt="Your art"
                          className="w-full h-full object-cover"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-6 text-white">
                            <span className="flex items-center gap-1.5">
                              <span>❤️</span>
                              <span className="font-medium">{art.likes}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span>🔓</span>
                              <span className="font-medium">{art.unlocks}</span>
                            </span>
                          </div>
                        </div>

                        {/* Emotion Badge */}
                        <div className="absolute top-3 right-3">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${EMOTION_CONFIG[art.emotion]?.color}20`,
                              color: EMOTION_CONFIG[art.emotion]?.color 
                            }}
                          >
                            {art.emotionIcon}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </Masonry>
            )}
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0084D1] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0070B8] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Account</h3>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCancel}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="modal-firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="modal-lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="modal-lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0084D1] focus:border-transparent transition-all outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0084D1] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#0070B8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
