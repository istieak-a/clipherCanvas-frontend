// Mock art service - simulates API calls with mock data
import { 
  getAllArt, 
  getArtById, 
  getUserArt, 
  createArt, 
  unlockArt, 
  toggleLike 
} from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const artService = {
  // Get all art posts
  async fetchAllArt() {
    await delay();
    return {
      success: true,
      data: getAllArt(),
    };
  },

  // Get single art post by ID
  async fetchArtById(id) {
    await delay();
    const art = getArtById(id);
    
    if (!art) {
      return {
        success: false,
        error: 'Art not found',
      };
    }
    
    return {
      success: true,
      data: art,
    };
  },

  // Get art posts by user
  async fetchUserArt(userId) {
    await delay();
    return {
      success: true,
      data: getUserArt(userId),
    };
  },

  // Create new art post
  async createArtPost(artData) {
    await delay(800);
    
    try {
      const newArt = createArt(artData);
      return {
        success: true,
        data: newArt,
        message: 'Art created successfully!',
      };
    } catch {
      return {
        success: false,
        error: 'Failed to create art',
      };
    }
  },

  // Unlock art with secret key
  async unlockArtPost(artId, secretKey) {
    await delay(600);
    return unlockArt(artId, secretKey);
  },

  // Toggle like on art post
  async toggleLikeArt(artId) {
    await delay(300);
    const isLiked = toggleLike(artId);
    return {
      success: true,
      isLiked,
    };
  },

  // Search art by emotion
  async searchByEmotion(emotion) {
    await delay();
    const allArt = getAllArt();
    const filtered = allArt.filter(art => art.emotion === emotion);
    
    return {
      success: true,
      data: filtered,
    };
  },

  // Get trending art (most likes)
  async fetchTrendingArt() {
    await delay();
    const allArt = getAllArt();
    const sorted = [...allArt].sort((a, b) => b.likes - a.likes).slice(0, 10);
    
    return {
      success: true,
      data: sorted,
    };
  },
};

export default artService;
