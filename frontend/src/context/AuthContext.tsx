import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RoleType } from '../types';
import { authApi, LoginPayload, RegisterPayload } from '../services/api';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginPayload) => Promise<User>;
  register: (userData: RegisterPayload) => Promise<User>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user_info');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('access_token');
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('refresh_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await authApi.getProfile();
          setUser(res.user);
          localStorage.setItem('user_info', JSON.stringify(res.user));
        } catch (err) {
          // Token expired or invalid, clear state
          console.warn('Session check failed, clearing tokens.');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_info');
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginPayload): Promise<User> => {
    setError(null);
    try {
      const response = await authApi.login(credentials);
      const access = response.access || response.tokens?.access;
      const refresh = response.refresh || response.tokens?.refresh;
      const loggedUser = response.user;

      if (access) {
        localStorage.setItem('access_token', access);
        setAccessToken(access);
      }
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
        setRefreshToken(refresh);
      }
      if (loggedUser) {
        localStorage.setItem('user_info', JSON.stringify(loggedUser));
        setUser(loggedUser);
      }

      return loggedUser;
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (userData: RegisterPayload): Promise<User> => {
    setError(null);
    try {
      const response = await authApi.register(userData);
      const access = response.access || response.tokens?.access;
      const refresh = response.refresh || response.tokens?.refresh;
      const registeredUser = response.user;

      if (access) {
        localStorage.setItem('access_token', access);
        setAccessToken(access);
      }
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
        setRefreshToken(refresh);
      }
      if (registeredUser) {
        localStorage.setItem('user_info', JSON.stringify(registeredUser));
        setUser(registeredUser);
      }

      return registeredUser;
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please check the provided information.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
