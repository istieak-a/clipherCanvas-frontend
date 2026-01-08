// Art service - handles API calls for encrypted art messages
import { getMessages, getMessage, createMessage, apiRequest } from './api';
import { EMOTIONS } from './mockData';
import { generatePattern } from './patternGenerator';

/**
 * Maps backend message object to frontend art object format
 */
const mapMessageToArt = (message) => {
  // Find emotion details from EMOTIONS array
  const emotionData = EMOTIONS.find(e => e.id === message.emotionPalette) || EMOTIONS[0];
  
  // Generate pattern from visualSeed AND emotion on the client-side
  const pattern = generatePattern(800, 600, message.visualSeed, message.emotionPalette);
  
  return {
    id: message._id,
    userId: message.sender._id,
    userName: message.sender.username,
    userUsername: message.sender.username,
    userAvatar: '👤', // Default avatar, could be enhanced later
    message: '', // Not exposed until unlocked
    encryptedMessage: message.encryptedContent,
    emotion: message.emotionPalette,
    emotionLabel: emotionData.label,
    emotionIcon: emotionData.icon,
    hint: message.hint || '',
    secretKey: '', // User must provide to unlock
    pattern: pattern, // Generated from visualSeed + emotion
    seed: message.visualSeed,
    likes: message.likes || 0,
    unlocks: message.unlocks || 0,
    comments: 0, // Not implemented yet
    createdAt: message.createdAt,
    isLiked: false, // Will be updated from backend
    isUnlocked: false, // Determined locally
  };
};

export const artService = {
  /**
   * Get all art posts from gallery (Public)
   */
  async fetchAllArt() {
    try {
      const messages = await getMessages();
      const artPosts = messages.map(mapMessageToArt);
      
      return {
        success: true,
        data: artPosts,
      };
    } catch (error) {
      console.error('Failed to fetch art:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch art',
      };
    }
  },

  /**
   * Get single art post by ID (Public)
   */
  async fetchArtById(id) {
    try {
      const message = await getMessage(id);
      const art = mapMessageToArt(message);
      
      return {
        success: true,
        data: art,
      };
    } catch (error) {
      console.error('Failed to fetch art:', error);
      return {
        success: false,
        error: error.message || 'Art not found',
      };
    }
  },

  /**
   * Get art posts by user (filters from all messages)
   */
  async fetchUserArt(userId) {
    try {
      const messages = await getMessages();
      const userMessages = messages.filter(msg => msg.sender._id === userId);
      const artPosts = userMessages.map(mapMessageToArt);
      
      return {
        success: true,
        data: artPosts,
      };
    } catch (error) {
      console.error('Failed to fetch user art:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch user art',
      };
    }
  },

  /**
   * Create new art post (Protected - requires auth)
   */
  async createArtPost(artData) {
    try {
      const messageData = {
        encryptedContent: artData.encryptedMessage,
        visualSeed: artData.seed,
        emotionPalette: artData.emotion,
        hint: artData.hint || '',
      };
      
      const message = await createMessage(messageData);
      const art = mapMessageToArt(message);
      
      return {
        success: true,
        data: art,
        message: 'Art created successfully!',
      };
    } catch (error) {
      console.error('Failed to create art:', error);
      return {
        success: false,
        error: error.message || 'Failed to create art',
      };
    }
  },

  /**
   * Unlock art with secret key (client-side decryption)
   * Also notifies backend to track unlock count
   */
  async unlockArtPost(artId, secretKey) {
    try {
      // Notify backend to track unlock (requires auth)
      await apiRequest(`/messages/${artId}/unlock`, {
        method: 'POST',
      });
    } catch (error) {
      // Silently fail - unlock tracking is optional
      console.warn('Could not track unlock:', error.message);
    }
    
    return {
      success: true,
      message: 'Unlock handled client-side',
      artId,
      secretKey,
    };
  },

  /**
   * Toggle like on art post
   */
  async toggleLikeArt(artId) {
    try {
      const response = await apiRequest(`/messages/${artId}/like`, {
        method: 'POST',
      });
      
      return {
        success: true,
        isLiked: response.data.liked,
        likes: response.data.likes,
      };
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return {
        success: false,
        isLiked: false,
        error: error.message,
      };
    }
  },

  /**
   * Search art by emotion (filters from all messages)
   */
  async searchByEmotion(emotion) {
    try {
      const messages = await getMessages();
      const filtered = messages.filter(msg => msg.emotionPalette === emotion);
      const artPosts = filtered.map(mapMessageToArt);
      
      return {
        success: true,
        data: artPosts,
      };
    } catch (error) {
      console.error('Failed to search art:', error);
      return {
        success: false,
        error: error.message || 'Failed to search art',
      };
    }
  },

  /**
   * Get trending art (Not yet implemented - returns all for now)
   */
  async fetchTrendingArt() {
    try {
      const messages = await getMessages();
      const artPosts = messages.map(mapMessageToArt);
      // TODO: Sort by likes when backend implements it
      
      return {
        success: true,
        data: artPosts.slice(0, 10),
      };
    } catch (error) {
      console.error('Failed to fetch trending art:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch trending art',
      };
    }
  },
};

export default artService;
