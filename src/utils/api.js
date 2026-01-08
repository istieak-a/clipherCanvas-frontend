// API Configuration and Fetch Wrapper
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * Enhanced fetch wrapper with error handling and auth token injection
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle unauthorized access (token expired or invalid)
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('unauthorized'));
      throw new Error('Session expired. Please login again.');
    }

    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ===== AUTH SERVICE FUNCTIONS =====

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName
    })
  });

  // Store token and user data
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
};

/**
 * Login user with credentials
 */
export const loginUser = async (credentials) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  });

  // Store token and user data
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
};

/**
 * Get current user profile (Protected)
 */
export const getUserProfile = async () => {
  const data = await apiRequest('/auth/profile', {
    method: 'GET'
  });
  return data.data.user;
};

/**
 * Update user profile (Protected)
 */
export const updateProfile = async (updates) => {
  const data = await apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({
      firstName: updates.firstName,
      lastName: updates.lastName,
      avatar: updates.avatar
    })
  });

  // Update stored user data
  localStorage.setItem('user', JSON.stringify(data.data.user));
  return data;
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export default apiRequest;
