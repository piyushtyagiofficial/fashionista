import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

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
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`);
      setUser(res.data);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (name, email, password, role) => {
    try {
      setError(null);
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { name, email, password, role }
      );

      const { token } = res.data;
      
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      setUser(res.data);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      const { token } = res.data;
      
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      setUser(res.data);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid credentials');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        userData
      );

      const { token } = res.data;
      
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      setUser(res.data);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      setError(null);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/wishlist`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setUser(prev => ({
        ...prev,
        wishlist: response.data.wishlist
      }));
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add to wishlist');
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setError(null);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/auth/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setUser(prev => ({
        ...prev,
        wishlist: response.data.wishlist
      }));
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove from wishlist');
      throw error;
    }
  };

  const getWishlist = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch wishlist');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        loadUser,
        addToWishlist,
        removeFromWishlist,
        getWishlist,
        isAuthenticated: !!user,
        isSeller: user?.role === 'seller',
        isBuyer: user?.role === 'buyer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};