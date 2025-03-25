import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
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
    // Initialize from localStorage if available
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const subscription = localStorage.getItem('subscription');
    return { token, role, subscription };
  });

  useEffect(() => {
    // Sync user state with localStorage
    if (user.token) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('role', user.role || '');
      localStorage.setItem('subscription', user.subscription || '');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('subscription');
    }
  }, [user]);

  const logout = () => {
    setUser({ token: null, role: null, subscription: null });
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