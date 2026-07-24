import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type User = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  favorites: any[];
  recentlyPlayed: any[];
  playlists: any[];
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password?: string) => Promise<void>;
  register: (name: string, username: string, password?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auralis_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (username: string, password?: string) => {
    try {
      const url = password 
        ? `http://localhost:3001/users?username=${username}&password=${password}`
        : `http://localhost:3001/users?username=${username}`;
        
      const res = await fetch(url);
      const users: User[] = await res.json();
      
      if (users.length > 0) {
        setUser(users[0]);
        localStorage.setItem('auralis_user', JSON.stringify(users[0]));
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const register = async (name: string, username: string, password?: string) => {
    try {
      // Check if user already exists
      const checkRes = await fetch(`http://localhost:3001/users?username=${username}`);
      const existingUsers: User[] = await checkRes.json();
      
      if (existingUsers.length > 0) {
        throw new Error('Username already exists');
      }

      // Create new user
      const newUser = {
        name,
        username,
        password: password || '',
        avatar: `https://placehold.co/100x100/7c3aed/white?text=${name.charAt(0).toUpperCase()}`,
        favorites: [],
        recentlyPlayed: [],
        playlists: []
      };

      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        throw new Error('Failed to register');
      }

      const createdUser: User = await res.json();
      setUser(createdUser);
      localStorage.setItem('auralis_user', JSON.stringify(createdUser));
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auralis_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('auralis_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
