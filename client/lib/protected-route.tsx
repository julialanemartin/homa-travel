import { ReactNode } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Redirect } from 'wouter';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole && !(requiredRole === 'user' && user.role === 'admin')) {
    return <Redirect to="/unauthorized" />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
}