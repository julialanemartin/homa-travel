import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, User, Mail, BadgeCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminSetup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { initialSetup, checkAdminExists, isAuthenticated } = useAdminAuth();
  const [location, navigate] = useLocation();

  // Check if admin exists
  useEffect(() => {
    const checkAdmin = async () => {
      setIsLoading(true);
      try {
        const exists = await checkAdminExists();
        setAdminExists(exists);
        
        // If admin exists, redirect to login
        if (exists) {
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Error checking admin:', err);
        setError('Could not check if admin exists');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, [checkAdminExists, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!username || !password || !email) {
      setError('Username, password, and email are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await initialSetup(username, password, email, fullName || undefined);
      if (success) {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError('An unexpected error occurred during setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-neutral-500">Checking admin status...</p>
        </div>
      </div>
    );
  }

  if (adminExists) {
    // This will only show briefly before redirect happens
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-neutral-500">Admin already exists, redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Setup | Homa Travel Co.</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-white rounded-t-lg">
              <CardTitle className="text-center text-xl font-bold">
                <BadgeCheck className="h-6 w-6 inline-block mr-2" />
                Homa Travel Co. Initial Setup
              </CardTitle>
              <CardDescription className="text-white/80 text-center">
                Create your administrator account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="username" className="mb-1">Username*</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="Create a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                      required
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="email" className="mb-1">Email*</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="fullName" className="mb-1">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name (optional)"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="password" className="mb-1">Password*</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Use at least 8 characters
                  </p>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="confirmPassword" className="mb-1">Confirm Password*</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up Account
                    </>
                  ) : (
                    'Create Admin Account'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center text-xs text-neutral-500 border-t">
              <p>This will create the initial admin account for Homa Travel Co.</p>
              <p>© {new Date().getFullYear()} Homa Travel Co. All rights reserved.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}