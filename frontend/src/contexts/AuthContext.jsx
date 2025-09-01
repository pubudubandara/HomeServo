import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('AuthContext - Checking authentication...');
      console.log('AuthContext - Token exists:', !!token);
      console.log('AuthContext - User data exists:', !!userData);
      
      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          console.log('AuthContext - Parsed user data:', parsedUserData);
          
          if (parsedUserData && parsedUserData._id) {
            console.log('AuthContext - Setting user:', parsedUserData);
            setUser(parsedUserData);
          } else {
            console.log('AuthContext - User data missing _id, clearing storage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (err) {
          console.error('AuthContext - Error parsing user data:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('AuthContext - No token or user data found');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData, token) => {
    console.log('AuthContext - Login called with:', userData);
    console.log('AuthContext - User ID:', userData?._id);
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
    
    console.log('AuthContext - User set in context:', userData);
    console.log('AuthContext - User stored in localStorage:', localStorage.getItem('user'));
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);