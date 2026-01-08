import { generatePattern } from './patternGenerator';

// Available emotions with their corresponding icons and colors
// These map to the emotion palettes in patternGenerator.js
export const EMOTIONS = [
  { id: 'passion', label: 'Passion', icon: '❤️', color: '#FF1744' },
  { id: 'calm', label: 'Calm', icon: '🌊', color: '#0084D1' },
  { id: 'joy', label: 'Joy', icon: '🌟', color: '#FFD600' },
  { id: 'mystery', label: 'Mystery', icon: '🔮', color: '#7C4DFF' },
  { id: 'nature', label: 'Nature', icon: '🌿', color: '#00C853' },
  { id: 'serenity', label: 'Serenity', icon: '☮️', color: '#00BCD4' },
];

// Mock users
const mockUsers = [
  { id: 1, name: 'Alice Chen', username: 'alice_art', avatar: '👩‍🎨' },
  { id: 2, name: 'Bob Martinez', username: 'bobcreates', avatar: '🧑‍💻' },
  { id: 3, name: 'Carol Singh', username: 'carol_crypto', avatar: '👩‍🔬' },
  { id: 4, name: 'David Kim', username: 'davidk', avatar: '🧑‍🎨' },
  { id: 5, name: 'Emma Wilson', username: 'emmaw_art', avatar: '👩‍🎤' },
  { id: 6, name: 'Frank Zhang', username: 'frank_z', avatar: '🧑‍🚀' },
];

// Generate mock art posts
const generateMockArt = () => {
  const artPosts = [];
  const messages = [
    'Life is beautiful when you find joy in little things.',
    'Every sunset is an opportunity to reset.',
    'The best is yet to come, keep believing!',
    'In the depths of winter, I finally learned that within me there lay an invincible summer.',
    'Stars cannot shine without darkness.',
    'Be yourself; everyone else is already taken.',
    'The journey of a thousand miles begins with a single step.',
    'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    'Turn your wounds into wisdom.',
    'The only way to do great work is to love what you do.',
    'Happiness is not by chance, but by choice.',
    'Dream big, work hard, stay focused.',
    'The secret of getting ahead is getting started.',
    'Believe you can and you\'re halfway there.',
    'Life is 10% what happens to you and 90% how you react to it.',
  ];

  const hints = [
    'The password is my favorite color',
    'Think about our first meeting place',
    'The year we graduated',
    'My pet\'s name',
    'Our special date (MMDD)',
    'The city where we met',
    'My favorite season',
    'The answer to life, universe, and everything',
    'My lucky number',
    'The first word I said to you',
    'Coffee or tea?',
    'My birth month',
    'The name of the first song we danced to',
    'Mountain or beach?',
    'My childhood nickname',
  ];

  for (let i = 0; i < 24; i++) {
    const userId = mockUsers[i % mockUsers.length].id;
    const user = mockUsers.find(u => u.id === userId);
    const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    const seed = Math.random();
    
    artPosts.push({
      id: i + 1,
      userId,
      userName: user.name,
      userUsername: user.username,
      userAvatar: user.avatar,
      message: messages[i % messages.length],
      encryptedMessage: btoa(messages[i % messages.length]), // Simple base64 encoding for demo
      emotion: emotion.id,
      emotionLabel: emotion.label,
      emotionIcon: emotion.icon,
      hint: hints[i % hints.length],
      secretKey: `secret${i + 1}`, // In real app, this would be hashed
      pattern: generatePattern(800, 600, seed),
      seed,
      likes: Math.floor(Math.random() * 500) + 10,
      unlocks: Math.floor(Math.random() * 200) + 5,
      comments: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      isLiked: false,
      isUnlocked: false,
    });
  }

  return artPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Initialize mock data
let mockArtData = generateMockArt();

// Helper functions
export const getAllArt = () => {
  return [...mockArtData];
};

export const getArtById = (id) => {
  return mockArtData.find(art => art.id === parseInt(id));
};

export const getUserArt = (userId) => {
  return mockArtData.filter(art => art.userId === userId);
};

export const createArt = (artData) => {
  const newArt = {
    id: mockArtData.length + 1,
    userId: 1, // Current user mock ID
    userName: 'Current User',
    userUsername: 'currentuser',
    userAvatar: '🎨',
    ...artData,
    likes: 0,
    unlocks: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
    isLiked: false,
    isUnlocked: false,
  };
  
  mockArtData.unshift(newArt);
  return newArt;
};

export const unlockArt = (artId, secretKey) => {
  const art = mockArtData.find(a => a.id === artId);
  if (!art) return { success: false, message: 'Art not found' };
  
  if (art.secretKey === secretKey) {
    art.isUnlocked = true;
    art.unlocks += 1;
    return { success: true, message: art.message };
  }
  
  return { success: false, message: 'Incorrect secret key' };
};

export const toggleLike = (artId) => {
  const art = mockArtData.find(a => a.id === artId);
  if (!art) return false;
  
  art.isLiked = !art.isLiked;
  art.likes += art.isLiked ? 1 : -1;
  return art.isLiked;
};

export const getEmotionById = (emotionId) => {
  return EMOTIONS.find(e => e.id === emotionId);
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
};
