import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext<{
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}>({
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // เช็ค Token ครั้งแรกที่เปิดแอป (แทน checkAuth ใน layout)
    const loadToken = async () => {
      const savedToken = Platform.OS === 'web' 
        ? localStorage.getItem('userToken') 
        : await SecureStore.getItemAsync('userToken');
      console.log('AuthContext: initial token loaded', savedToken);
      setToken(savedToken);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    setToken(newToken);
    console.trace('AuthContext.login called');
    if (Platform.OS === 'web') {
      localStorage.setItem('userToken', newToken);
    } else {
      await SecureStore.setItemAsync('userToken', newToken);
    }
  };

  const logout = async () => {
    console.trace('AuthContext.logout called');
    setToken(null);
    if (Platform.OS === 'web') {
      localStorage.removeItem('userToken');
    } else {
      await SecureStore.deleteItemAsync('userToken');
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);