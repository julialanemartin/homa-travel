import React from 'react';
import { useLocation, Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { HomaLogo } from '@/components/logo/HomaLogo';
import { 
  LayoutDashboard, 
  Globe, 
  Settings,
  FileText,
  Package,
  MessageSquareQuote,
  Users,
  HelpCircle,
  LogOut,
  Menu,
  X,
  MapPin
} from 'lucide-react';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAdminAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Destinations', href: '/admin/destinations', icon: <Globe className="h-5 w-5" /> },
    { label: 'Local Destinations', href: '/admin/local-destinations', icon: <MapPin className="h-5 w-5" /> },
    { label: 'Blog Posts', href: '/admin/blog-posts', icon: <FileText className="h-5 w-5" /> },
    { label: 'Products', href: '/admin/products', icon: <Package className="h-5 w-5" /> },
    { label: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquareQuote className="h-5 w-5" /> },
    { label: 'User Quiz', href: '/admin/quiz', icon: <HelpCircle className="h-5 w-5" /> },
    { label: 'Admin Users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { label: 'Site Settings', href: '/admin/site-settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location === '/admin';
    }
    return location.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#f0f5f7] flex flex-col">
      <Helmet>
        <title>Admin | Homa Travel Co.</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Bar */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="md:hidden mr-2 p-1" 
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <Link href="/admin" className="flex items-center">
            <HomaLogo size="sm" variant="text-only" />
            <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
          </Link>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center">
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside 
          className={`
            ${isMobileMenuOpen ? 'block' : 'hidden'} 
            md:block fixed md:sticky top-[57px] z-30 md:z-0 h-[calc(100vh-57px)] 
            w-64 bg-white border-r overflow-y-auto transition-all
          `}
        >
          <nav className="p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm
                      ${isActive(item.href)
                        ? 'bg-primary text-white font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="px-3 py-2">
              <h3 className="text-xs uppercase font-semibold text-neutral-500 tracking-wider">
                Admin Info
              </h3>
              <div className="mt-2 text-xs text-neutral-500">
                <p>Version: 1.0.0</p>
                <p className="mt-1">© 2023-{new Date().getFullYear()} Homa Travel Co.</p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1">
          {/* Backdrop for mobile */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-20 md:hidden" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;