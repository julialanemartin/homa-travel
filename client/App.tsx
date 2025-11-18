// App.tsx
import React, { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.js";
import NotFound from "@/pages/NotFound.jsx";
import Header from "@/components/layout/Header.js";
import Footer from "@/components/layout/Footer.js";
import Home from "@/pages/Home.js";
import Destinations from "@/pages/Destinations.js";
import DestinationDetail from "@/pages/DestinationDetail.js";
import DestinationShowcase from "@/pages/DestinationShowcase.js";
import Blog from "@/pages/Blog.js";
import BlogPost from "@/pages/BlogPost.js";
import Shop from "@/pages/Shop.js";
import Product from "@/pages/Product.js";
import DestinationMatcher from "@/pages/DestinationMatcher.js";
import FlightTracker from "@/pages/FlightTracker.js";
import MoodBoardDemo from "@/pages/MoodBoardDemo.js";
import BudgetCalculator from "@/pages/BudgetCalculator.js";
import TripPlanner from "@/pages/TripPlanner.js";
import About from "@/pages/About.js";
import Cart from "@/pages/Cart.js";
import Checkout from "@/pages/Checkout.js";
import AuthPage from "@/pages/auth-page.js";
import Dashboard from "@/pages/Dashboard.js";
import AffiliateShowcase from "@/pages/AffiliateShowcase.js";
import LocalDestinations from "@/pages/LocalDestinations.js";
import TestLogin from "@/pages/TestLogin.js";
import DirectAdminTest from "@/pages/DirectAdminTest.js";
import { CartProvider } from "@/providers/CartProvider.js";
import { AuthProvider } from "@/hooks/use-auth.js";
import { ProtectedRoute } from "@/lib/protected-route.js";
import { AdminAuthProvider } from "@/hooks/use-admin-auth.js";
import AdminLogin from "@/pages/admin/AdminLogin.js";
import NewAdminLogin from "@/pages/admin/NewAdminLogin.js";
import AdminQuickFix from "@/pages/AdminQuickFix.js";
import AdminSetup from "@/pages/admin/AdminSetup.js";
import AdminDashboard from "@/pages/admin/AdminDashboard.js";
import AdminDestinations from "@/pages/admin/AdminDestinations.js";
import AdminSiteSettings from "@/pages/admin/AdminSiteSettings.js";
import AdminQuiz from "@/pages/admin/AdminQuiz.js";
import AdminUserManagement from "@/pages/admin/AdminUserManagement.js";
import AdminBlogPosts from "@/pages/admin/AdminBlogPosts.js";
import AdminLocalDestinations from "@/pages/admin/AdminLocalDestinations.js";
import AdminFlightAnalytics from "@/pages/admin/AdminFlightAnalytics.js";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute.js";

const MainRouter: React.FC = () => {
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
          <Route
            path="/dashboard"
            component={() => (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/cart"
            component={() => (
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/checkout"
            component={() => (
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            )}
          />
          <Route path="/auth" component={AuthPage} />
          <Route path="/test-login" component={TestLogin} />
          <Route path="/direct-admin-test" component={DirectAdminTest} />
          <Route path="/admin-test" component={DirectAdminTest} />
          <Route path="/admin-fix" component={AdminQuickFix} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
};

const AdminRouter: React.FC = () => {
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
      <AdminProtectedRoute
        path="/admin/products"
        component={() => (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Products Management</h1>
            <p>Products admin page coming soon</p>
          </div>
        )}
      />
      <AdminProtectedRoute
        path="/admin/testimonials"
        component={() => (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Testimonials Management</h1>
            <p>Testimonials admin page coming soon</p>
          </div>
        )}
      />
      <AdminProtectedRoute path="/admin/users" component={AdminUserManagement} />
      <AdminProtectedRoute path="/admin/flight-analytics" component={AdminFlightAnalytics} />
    </Switch>
  );
};

const Router: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(window.location.pathname.startsWith("/admin"));
    }
  }, []);

  if (isAdmin) {
    return (
      <AdminAuthProvider>
        <AdminRouter />
      </AdminAuthProvider>
    );
  }

  return <MainRouter />;
};

const App: React.FC = () => {
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
};

export default App;
