import { useState } from 'react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, Lock, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminUserManagement() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { registerAdmin } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
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
      const success = await registerAdmin(username, password, email, fullName || undefined);
      if (success) {
        setSuccess('Admin user created successfully');
        // Reset form
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setFullName('');
      }
    } catch (err) {
      console.error('Admin registration error:', err);
      setError('An unexpected error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin User Management | Homa Travel Co.</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin User Management</h1>
            <p className="text-neutral-500">Create and manage admin user accounts</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Register New Admin
              </CardTitle>
              <CardDescription>
                Create a new administrator account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
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
                      placeholder="Email address"
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
                    placeholder="Full name (optional)"
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
                      placeholder="Confirm password"
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Admin
                    </>
                  ) : (
                    'Create Admin Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin User Guidelines</CardTitle>
                <CardDescription>
                  Important information about admin accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-medium">Admin Privileges</h3>
                    <p className="text-neutral-600">
                      Admin users have full access to manage all aspects of the website, including content, settings, and user data.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Security Best Practices</h3>
                    <ul className="list-disc pl-5 text-neutral-600 space-y-1">
                      <li>Use strong, unique passwords</li>
                      <li>Don't share admin credentials</li>
                      <li>Use separate admin accounts for each team member</li>
                      <li>Log out when not using the admin panel</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Account Management</h3>
                    <p className="text-neutral-600">
                      If an admin needs to be removed, please contact the site owner as this functionality is currently limited to direct database operations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Placeholder for future user listing functionality */}
            <Card>
              <CardHeader>
                <CardTitle>Current Admins</CardTitle>
                <CardDescription>
                  This feature is coming soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 text-sm">
                  The ability to view and manage existing admin accounts will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}