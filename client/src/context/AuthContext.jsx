import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    toast.success('Logged out successfully');
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setCurrentUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setCurrentUser(data.user);
      toast.success('Account created successfully!');
      return data;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach(err => toast.error(err.msg || 'Validation error'));
      } else {
        toast.error(errorData?.message || 'Registration failed');
      }
      throw error;
    }
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('forge_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load user', error);
      localStorage.removeItem('forge_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    refreshUser: loadUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
