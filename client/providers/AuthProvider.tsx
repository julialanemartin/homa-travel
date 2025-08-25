import React, { createContext, useContext, useState } from 'react';
import { User } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; email: string; password: string; fullName?: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would make an API call to authenticate
      // For now, we'll simulate a successful login with a temporary user
      setUser({
        id: 1,
        username,
        email: `${username}@example.com`,
        fullName: "Demo User"
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { username: string; email: string; password: string; fullName?: string }) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/users', userData);
      
      if (response.ok) {
        const newUser = await response.json();
        setUser(newUser);
        toast({
          title: "Registration successful",
          description: `Welcome, ${newUser.username}!`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Could not create account. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
