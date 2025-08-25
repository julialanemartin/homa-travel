import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Map, 
  ShoppingBag, 
  MessageSquare, 
  Users, 
  LogOut, 
  Home,
  BarChart3,
  Settings,
  HelpCircle,
  Plane,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAdminAuth();
  const [_, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const adminLinks = [
    { name: 'Dashboard', icon: <BarChart3 className="h-5 w-5" />, path: '/admin' },
    { name: 'Destinations', icon: <Map className="h-5 w-5" />, path: '/admin/destinations' },
    { name: 'Blog Posts', icon: <BookOpen className="h-5 w-5" />, path: '/admin/blog-posts' },
    { name: 'Products', icon: <ShoppingBag className="h-5 w-5" />, path: '/admin/products' },
    { name: 'Testimonials', icon: <MessageSquare className="h-5 w-5" />, path: '/admin/testimonials' },
    { name: 'Flight Analytics', icon: <Plane className="h-5 w-5" />, path: '/admin/flight-analytics' },
    { name: 'Quiz Management', icon: <HelpCircle className="h-5 w-5" />, path: '/admin/quiz' },
    { name: 'Users', icon: <Users className="h-5 w-5" />, path: '/admin/users' },
    { name: 'Site Settings', icon: <Settings className="h-5 w-5" />, path: '/admin/site-settings' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Homa Travel Co.</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Admin Header */}
        <header className="bg-primary text-white py-4 px-6 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Homa Travel Co. Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.username}</span>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="flex flex-grow">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-neutral-50 border-r shadow-sm">
            <nav className="p-4">
              <ul className="space-y-1">
                {adminLinks.map((link) => (
                  <li key={link.path}>
                    <Link href={link.path}>
                      <a className="flex items-center p-3 rounded-md hover:bg-neutral-100 transition-colors text-neutral-700 hover:text-primary">
                        {link.icon}
                        <span className="ml-3">{link.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
                <li className="pt-4 mt-4 border-t">
                  <Link href="/">
                    <a className="flex items-center p-3 rounded-md hover:bg-neutral-100 transition-colors text-neutral-700 hover:text-primary">
                      <Home className="h-5 w-5" />
                      <span className="ml-3">View Website</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Admin Content */}
          <main className="flex-grow p-6 bg-neutral-100">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Destinations</CardTitle>
                  <CardDescription>Total travel destinations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Map className="h-8 w-8 text-primary mr-4" />
                    <span className="text-3xl font-bold">12</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Blog Posts</CardTitle>
                  <CardDescription>Published articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-primary mr-4" />
                    <span className="text-3xl font-bold">24</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Products</CardTitle>
                  <CardDescription>Digital products for sale</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <ShoppingBag className="h-8 w-8 text-primary mr-4" />
                    <span className="text-3xl font-bold">8</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Testimonials</CardTitle>
                  <CardDescription>Customer reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-primary mr-4" />
                    <span className="text-3xl font-bold">36</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Users</CardTitle>
                  <CardDescription>Registered accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-primary mr-4" />
                    <span className="text-3xl font-bold">142</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Flight Alerts</CardTitle>
                  <CardDescription>Active price tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Plane className="h-8 w-8 text-primary mr-4" />
                    <span className="text-3xl font-bold">14</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Button>
                  <Map className="mr-2 h-4 w-4" />
                  Add Destination
                </Button>
                <Button>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create Blog Post
                </Button>
                <Button>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
                <Link href="/admin/quiz">
                  <Button variant="secondary">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Manage Quiz Questions
                  </Button>
                </Link>
                <Link href="/admin/flight-analytics">
                  <Button variant="secondary">
                    <Plane className="mr-2 h-4 w-4" />
                    Flight Analytics
                  </Button>
                </Link>
                <Link href="/admin/site-settings">
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Site Settings
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}