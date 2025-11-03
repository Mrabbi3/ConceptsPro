import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultUser } from '../config/data/courses';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('conceptspro-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('conceptspro-user');
      }
    }
  }, []);

  useEffect(() => {
    // Save user to localStorage only if user exists
    if (user) {
      localStorage.setItem('conceptspro-user', JSON.stringify(user));
    }
  }, [user]);

  const login = (email, password, role) => {
    // MVP: Simple login (in production, this would be API call)
    const userData = {
      id: role === 'student' ? 'student1' : 'instructor1',
      name: role === 'student' ? 'John Student' : 'Dr. Sarah Johnson',
      email: email,
      role: role,
      enrolledCourses: role === 'student' ? ['cs101-data-communication', 'cs201-networks'] : []
    };
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('conceptspro-user');
    // Reset to default state
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

