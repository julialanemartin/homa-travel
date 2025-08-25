import { useState, useEffect, createContext, useContext } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from './use-toast';

type AdminUser = {
  id: number;
  username: string;
  isAdmin: boolean;
};

type AdminAuthContextType = {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  initialSetup: (username: string, password: string, email: string, fullName?: string) => Promise<boolean>;
  checkAdminExists: () => Promise<boolean>;
  registerAdmin: (username: string, password: string, email: string, fullName?: string) => Promise<boolean>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'admin_auth_token';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if there's a token in local storage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Verify the stored token
  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      // If there's an error, clear the token
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting admin login with:', { username, passwordLength: password.length });
      
      // Use fetch directly instead of apiRequest to handle auth errors properly
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Login response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, received data:', data);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        return true;
      } else {
        let errorMessage = "Invalid credentials";
        try {
          const errorData = await response.json();
          console.log('Login error response:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If we can't parse the error, use the default message
          errorMessage = response.statusText || errorMessage;
        }
        
        console.log('Login failed with message:', errorMessage);
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: `Connection error: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  // Check if any admin users exist
  const checkAdminExists = async () => {
    try {
      const response = await fetch('/api/admin/check-exists');
      if (response.ok) {
        const data = await response.json();
        return data.adminExists;
      }
      return true; // Default to true if we can't check
    } catch (error) {
      console.error('Error checking admin existence:', error);
      return true; // Default to true if API call fails
    }
  };

  // Initial admin setup - can only be used when no admins exist
  const initialSetup = async (username: string, password: string, email: string, fullName?: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/admin/initial-setup', { 
        username, 
        password, 
        email, 
        fullName 
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        
        toast({
          title: "Admin account created",
          description: "Your admin account has been set up successfully",
        });
        
        return true;
      } else {
        const error = await response.json();
        toast({
          title: "Setup failed",
          description: error.message || "Could not create admin account",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Admin setup error:', error);
      toast({
        title: "Setup failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register additional admin (requires existing admin token)
  const registerAdmin = async (username: string, password: string, email: string, fullName?: string) => {
    try {
      if (!token) {
        toast({
          title: "Authentication required",
          description: "You must be logged in as an admin to register new admin users",
          variant: "destructive"
        });
        return false;
      }
      
      setIsLoading(true);
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password, email, fullName })
      });
      
      if (response.ok) {
        toast({
          title: "Admin registered",
          description: "New admin user created successfully",
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: "Registration failed",
          description: error.message || "Could not create admin account",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Admin registration error:', error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user && !!token,
      initialSetup,
      checkAdminExists,
      registerAdmin
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}