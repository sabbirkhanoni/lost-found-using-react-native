import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, getMeApi } from '../api/auth.api';
import {
  linkOneSignalUser,
  unlinkOneSignalUser,
} from '../utils/pushNotifications';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const response = await getMeApi();
          setUser(response.data.user);
          linkOneSignalUser(response.data.user._id);
        }
      } catch (error) {
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    const response = await loginApi({ email, password });
    const { token: newToken, user: loggedInUser } = response.data;
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    linkOneSignalUser(loggedInUser._id);
    return response.data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
    unlinkOneSignalUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
