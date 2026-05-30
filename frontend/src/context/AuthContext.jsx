import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

  // Set up axios interceptor for auth token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }
      
      try {
        // Set the token in headers
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        const response = await api.get('/auth/me');
        
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          // Invalid response format, clear token
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error('Auth check failed:', error?.response?.status);
        // Only clear token on 401/422 errors
        if (error.response && (error.response.status === 401 || error.response.status === 422)) {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      // Store token and update state
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(userData);
      
      toast.success('Welcome back!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      
      // Store token and update state
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(userData);
      
      toast.success('Account created successfully!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    api,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { api };