import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { LoginForm } from '../components/ui/auth/login-form';
import { SignupForm } from '../components/ui/auth/signup-form';
import { PasswordResetRequestForm } from '../components/ui/auth/password-reset-request-form';
import { PasswordResetForm } from '../components/ui/auth/password-reset-form';
import { useAuth } from '../hooks/use-auth';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-password';

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('login');
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to home if already logged in
    if (user) {
      navigate('/');
      return;
    }

    // Determine which form to show based on the URL path
    if (location === '/login') {
      setView('login');
    } else if (location === '/signup') {
      setView('signup');
    } else if (location === '/forgot-password') {
      setView('forgot-password');
    } else if (location.startsWith('/reset-password')) {
      setView('reset-password');
    }
  }, [location, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {view === 'login' && <LoginForm />}
        {view === 'signup' && <SignupForm />}
        {view === 'forgot-password' && <PasswordResetRequestForm />}
        {view === 'reset-password' && <PasswordResetForm />}
      </div>
    </div>
  );
}