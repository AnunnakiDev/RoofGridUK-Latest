import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Change to named import

interface DecodedToken {
  id: number;
  username: string;
  role: string;
  subscription: string;
}

interface User {
  id: number | null;
  token: string | null;
  role: string | null;
  subscription: string | null;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const id = localStorage.getItem('id') ? Number(localStorage.getItem('id')) : null;
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const subscription = localStorage.getItem('subscription');

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        return {
          id: decoded.id,
          token,
          role: decoded.role || role,
          subscription: decoded.subscription || subscription,
        };
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('subscription');
        return { id: null, token: null, role: null, subscription: null };
      }
    }
    return { id: null, token: null, role: null, subscription: null };
  });

  useEffect(() => {
    if (user.token) {
      localStorage.setItem('id', user.id?.toString() || '');
      localStorage.setItem('token', user.token);
      localStorage.setItem('role', user.role || '');
      localStorage.setItem('subscription', user.subscription || '');
    } else {
      localStorage.removeItem('id');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('subscription');
    }
  }, [user]);

  const logout = () => {
    setUser({ id: null, token: null, role: null, subscription: null });
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};