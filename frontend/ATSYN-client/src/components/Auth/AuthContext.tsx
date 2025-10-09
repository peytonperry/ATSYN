import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthUser {
  userId: number;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userId: number, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const login = (userId: number, role: string) => {
    const authUser = { userId, role };
    setUser(authUser);
    localStorage.setItem('authUser', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'Admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}