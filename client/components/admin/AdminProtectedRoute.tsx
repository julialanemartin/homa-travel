import React from 'react';
import { Route, Redirect } from 'wouter';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Loader2 } from 'lucide-react';

type RouteParams = { [paramName: string]: string | undefined };

interface AdminProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export default function AdminProtectedRoute({ path, component: Component }: AdminProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        {() => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </Route>
    );
  }

  if (!isAuthenticated) {
    return (
      <Route path={path}>
        {() => <Redirect to="/admin/login" />}
      </Route>
    );
  }

  return (
    <Route path={path}>
      {(params: RouteParams) => <Component params={params} />}
    </Route>
  );
}