import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Destinations from "@/pages/Destinations";
import DestinationDetail from "@/pages/DestinationDetail";
import DestinationShowcase from "@/pages/DestinationShowcase";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import DestinationMatcher from "@/pages/DestinationMatcher";

import FlightTracker from "@/pages/FlightTracker";
import MoodBoardDemo from "@/pages/MoodBoardDemo";
import BudgetCalculator from "@/pages/BudgetCalculator";
import TripPlanner from "@/pages/TripPlanner";
import About from "@/pages/About";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/Dashboard";
import AffiliateShowcase from "@/pages/AffiliateShowcase";
import LocalDestinations from "@/pages/LocalDestinations";
import TestLogin from "@/pages/TestLogin";
import DirectAdminTest from "@/pages/DirectAdminTest";
import { CartProvider } from "@/providers/CartProvider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import AdminLogin from "@/pages/admin/AdminLogin";
import NewAdminLogin from "@/pages/admin/NewAdminLogin";
import AdminQuickFix from "@/pages/AdminQuickFix";
import AdminSetup from "@/pages/admin/AdminSetup";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminDestinations from "@/pages/admin/AdminDestinations";
import AdminSiteSettings from "@/pages/admin/AdminSiteSettings";
import AdminQuiz from "@/pages/admin/AdminQuiz";
import AdminUserManagement from "@/pages/admin/AdminUserManagement";
import AdminBlogPosts from "@/pages/admin/AdminBlogPosts";
import AdminLocalDestinations from "@/pages/admin/AdminLocalDestinations";
import AdminFlightAnalytics from "@/pages/admin/AdminFlightAnalytics";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

// Main website router
function MainRouter() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f5f7]">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/destinations" component={Destinations} />
          <Route path="/destinations/:id" component={DestinationDetail} />
          <Route path="/destination-showcase" component={DestinationShowcase} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route path="/shop" component={Shop} />
          <Route path="/shop/:id" component={Product} />
          <Route path="/destination-matcher" component={DestinationMatcher} />
          <Route path="/local-destinations" component={LocalDestinations} />

          <Route path="/flight-tracker" component={FlightTracker} />
          <Route path="/mood-board" component={MoodBoardDemo} />
          <Route path="/budget-calculator" component={BudgetCalculator} />
          <Route path="/trip-planner" component={TripPlanner} />
          <Route path="/about" component={About} />
          <Route path="/travel-resources" component={AffiliateShowcase} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/cart" component={Cart} />
          <ProtectedRoute path="/checkout" component={Checkout} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/test-login" component={TestLogin} />
          <Route path="/direct-admin-test" component={DirectAdminTest} />
          <Route path="/admin-test" component={DirectAdminTest} />
          <Route path="/admin-fix" component={AdminQuickFix} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

// Admin router
function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin/login" component={NewAdminLogin} />
      <Route path="/admin/setup" component={AdminSetup} />
      <Route path="/admin/test" component={DirectAdminTest} />
      <AdminProtectedRoute path="/admin" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/destinations" component={AdminDestinations} />
      <AdminProtectedRoute path="/admin/local-destinations" component={AdminLocalDestinations} />
      <AdminProtectedRoute path="/admin/site-settings" component={AdminSiteSettings} />
      <AdminProtectedRoute path="/admin/quiz" component={AdminQuiz} />
      <AdminProtectedRoute path="/admin/blog-posts" component={AdminBlogPosts} />
      <AdminProtectedRoute path="/admin/products" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">Products Management</h1><p>Products admin page coming soon</p></div>} />
      <AdminProtectedRoute path="/admin/testimonials" component={() => <div className="p-8"><h1 className="text-2xl font-bold mb-4">Testimonials Management</h1><p>Testimonials admin page coming soon</p></div>} />
      <AdminProtectedRoute path="/admin/users" component={AdminUserManagement} />
      <AdminProtectedRoute path="/admin/flight-analytics" component={AdminFlightAnalytics} />
    </Switch>
  );
}

// Combined router
function Router() {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <AdminRouter />
      </AdminAuthProvider>
    );
  }
  
  return <MainRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
