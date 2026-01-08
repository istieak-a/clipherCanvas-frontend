import { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser as loginAPI, 
  registerUser as registerAPI, 
  logoutUser as logoutAPI,
  getUserProfile,
  getCurrentUser as getStoredUser
} from '../utils/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const storedUser = getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
            
            // Optionally verify token with backend
            try {
              const freshUser = await getUserProfile();
              setUser(freshUser);
              localStorage.setItem('user', JSON.stringify(freshUser));
            } catch (error) {
              // Token might be expired, clear auth
              console.error('Token verification failed:', error);
              logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for unauthorized events (token expiry)
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const response = await loginAPI(credentials);
    setUser(response.data.user);
    setIsAuthenticated(true);
    return response;
  };

  const signup = async (userData) => {
    const response = await registerAPI(userData);
    setUser(response.data.user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    logoutAPI();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
