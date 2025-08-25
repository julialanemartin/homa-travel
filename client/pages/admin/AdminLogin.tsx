import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, isAuthenticated } = useAdminAuth();
  const [location, navigate] = useLocation();

  // Redirect to admin dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) return;
    
    setIsSubmitting(true);
    setErrorMessage(''); // Clear previous errors
    console.log('Form submit - attempting login with:', { username, passwordLength: password.length });
    
    try {
      // Direct API call to bypass any context issues
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Login response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response body:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('Login successful, received data:', data);
          
          // Store token in localStorage manually
          localStorage.setItem('admin_auth_token', data.token);
          
          // Force immediate redirect without relying on context
          localStorage.setItem('admin_auth_token', data.token);
          alert('Login successful! Redirecting to admin dashboard...');
          window.location.href = '/admin';
        } catch (parseError) {
          console.error('Failed to parse success response:', parseError);
          setErrorMessage('✅ Login succeeded but response parsing failed');
        }
      } else {
        let errorMsg = 'Login failed';
        try {
          const errorData = JSON.parse(responseText);
          console.log('Login error response:', errorData);
          errorMsg = errorData.message || errorMsg;
        } catch {
          errorMsg = `Login failed (${response.status}): ${responseText}`;
        }
        
        console.log('Setting error message:', errorMsg);
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error('Login form error:', error);
      const errorMsg = `Connection error: ${error.message}`;
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Homa Travel Co.</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-white rounded-t-lg">
              <CardTitle className="text-center text-xl font-bold">Homa Travel Co. Admin</CardTitle>
              <CardDescription className="text-white/80 text-center">
                Please log in to manage your travel website
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {errorMessage && (
                <div className="mb-4 p-6 bg-red-500 border-4 border-red-700 rounded-lg shadow-lg">
                  <p className="text-white font-bold text-xl text-center">
                    ❌ ERROR: {errorMessage}
                  </p>
                </div>
              )}
              
              <div className="mb-4 p-6 bg-blue-500 border-4 border-blue-700 rounded-lg text-center shadow-xl">
                <p className="text-white font-black text-2xl">
                  DIRECT LOGIN - BYPASS ISSUES
                </p>
                <p className="text-white font-bold text-lg mt-2">
                  Admin ready: admin/admin123
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="username" className="mb-1">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                      required
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="password" className="mb-1">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging In
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center text-xs text-neutral-500 border-t">
              <p>This area is for administrators only.</p>
              <p>© {new Date().getFullYear()} Homa Travel Co. All rights reserved.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}