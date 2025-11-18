import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button.js';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.js';
import { useCart } from '@/providers/CartProvider.js';
import { useAuth } from '@/hooks/use-auth.js';
import { Compass, User, ShoppingBag, Search, Menu, X, LogOut, LogIn, Loader2, Globe, BookOpen, MapPin, Info, DollarSign, MapPinned, Camera, Plane, Pin, Layout, Calendar } from 'lucide-react';
import { HomaLogo } from '@/components/logo/HomaLogo.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.js";

export default function Header() {
  const [, setLocation] = useLocation();
  const [currentLocation] = useLocation();
  const { cartCount } = useCart();
  const { user, logoutMutation } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <header className="border-b border-[#dce6ea] sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer">
              <HomaLogo size="md" />
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link 
              href="/destinations" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/destinations" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
              }`}
            >
              <Globe className={`h-3.5 w-3.5 ${currentLocation === "/destinations" ? "text-homa-blue" : "text-gray-400"}`} />
              <span>Destinations</span>
            </Link>
            <Link 
              href="/blog" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-green-50 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/blog" ? "text-emerald-600 bg-green-50" : "text-gray-600"
              }`}
            >
              <BookOpen className={`h-3.5 w-3.5 ${currentLocation === "/blog" ? "text-emerald-600" : "text-gray-400"}`} />
              <span>Blog</span>
            </Link>
            <Link 
              href="/shop" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-amber-50 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/shop" ? "text-amber-600 bg-amber-50" : "text-gray-600"
              }`}
            >
              <ShoppingBag className={`h-3.5 w-3.5 ${currentLocation === "/shop" ? "text-amber-600" : "text-gray-400"}`} />
              <span>Shop</span>
            </Link>
            <Link 
              href="/destination-matcher" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-purple-50 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/destination-matcher" ? "text-purple-600 bg-purple-50" : "text-gray-600"
              }`}
            >
              <MapPin className={`h-3.5 w-3.5 ${currentLocation === "/destination-matcher" ? "text-purple-600" : "text-gray-400"}`} />
              <span>Find Your Match</span>
            </Link>
            <Link 
              href="/local-destinations" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/local-destinations" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
              }`}
            >
              <MapPinned className={`h-3.5 w-3.5 ${currentLocation === "/local-destinations" ? "text-homa-blue" : "text-gray-400"}`} />
              <span>US Destinations</span>
            </Link>
            <Link 
              href="/travel-resources" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/travel-resources" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
              }`}
            >
              <DollarSign className={`h-3.5 w-3.5 ${currentLocation === "/travel-resources" ? "text-homa-blue" : "text-gray-400"}`} />
              <span>Travel Resources</span>
            </Link>

            <Link 
              href="/flight-tracker" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/flight-tracker" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
              }`}
            >
              <Plane className={`h-3.5 w-3.5 ${currentLocation === "/flight-tracker" ? "text-homa-blue" : "text-gray-400"}`} />
              <span>Flight Tracker</span>
            </Link>
            <Link 
              href="/mood-board" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/mood-board" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
              }`}
            >
              <Layout className={`h-3.5 w-3.5 ${currentLocation === "/mood-board" ? "text-homa-blue" : "text-gray-400"}`} />
              <span>Mood Boards</span>
            </Link>
            <Link 
              href="/budget-calculator" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/budget-calculator" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
              }`}
            >
              <DollarSign className={`h-3.5 w-3.5 ${currentLocation === "/budget-calculator" ? "text-homa-blue" : "text-gray-400"}`} />
              <span>Budget Calculator</span>
            </Link>
            <Link 
              href="/trip-planner" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/trip-planner" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
              }`}
            >
              <Calendar className={`h-3.5 w-3.5 ${currentLocation === "/trip-planner" ? "text-homa-blue" : "text-gray-400"}`} />
              <span>Trip Planner</span>
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                currentLocation === "/about" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
              }`}
            >
              <Info className={`h-3.5 w-3.5 ${currentLocation === "/about" ? "text-homa-blue" : "text-gray-400"}`} />
              <span>About</span>
            </Link>
            
            {user && (
              <Link 
                href="/dashboard" 
                className={`px-3 py-1.5 rounded-md text-sm hover:bg-homa-blue/10 transition-colors flex items-center space-x-1.5 ${
                  currentLocation === "/dashboard" ? "text-homa-blue bg-homa-blue/10" : "text-gray-600"
                }`}
              >
                <User className={`h-3.5 w-3.5 ${currentLocation === "/dashboard" ? "text-homa-blue" : "text-gray-400"}`} />
                <span>My Dashboard</span>
              </Link>
            )}
          </nav>
          
          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 hover:bg-primary/10 text-gray-600 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{user.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px] border border-primary/10">
                  <DropdownMenuLabel className="text-xs font-normal text-primary">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem onClick={() => setLocation("/profile")} className="text-xs hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/bookings")} className="text-xs hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/favorites")} className="text-xs hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem 
                    onClick={() => logoutMutation.mutate()} 
                    disabled={logoutMutation.isPending}
                    className="text-xs text-rose-600 hover:bg-rose-50 focus:bg-rose-50"
                  >
                    {logoutMutation.isPending ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Logging out...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-3 w-3" />
                        Logout
                      </div>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link href="/auth">
                  <Button 
                    variant="ghost" 
                    className="h-8 px-3 text-xs text-primary hover:bg-primary/5 hover:text-primary"
                  >
                    <LogIn className="h-3.5 w-3.5 mr-1.5" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth?register=true">
                  <Button 
                    size="sm"
                    className="h-8 px-3 text-xs bg-gradient-primary hover:opacity-90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Cart Icon */}
            <Link href="/cart" className="hidden md:inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors relative">
              <ShoppingBag className="h-3.5 w-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-1.5 h-auto bg-gray-50 hover:bg-gray-100 rounded-md">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] border-l border-primary/10">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <HomaLogo size="sm" variant="text-only" />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-3 mt-6">
                  <Link 
                    href="/destinations" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/destinations" 
                        ? "bg-homa-blue/10 text-homa-blue" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Globe className={`h-4 w-4 ${currentLocation === "/destinations" ? "text-homa-blue" : "text-gray-400"}`} />
                    <span>Destinations</span>
                  </Link>
                  <Link 
                    href="/blog" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/blog" 
                        ? "bg-green-50 text-emerald-600" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <BookOpen className={`h-4 w-4 ${currentLocation === "/blog" ? "text-emerald-600" : "text-gray-400"}`} />
                    <span>Blog</span>
                  </Link>
                  <Link 
                    href="/shop" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/shop" 
                        ? "bg-amber-50 text-amber-600" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <ShoppingBag className={`h-4 w-4 ${currentLocation === "/shop" ? "text-amber-600" : "text-gray-400"}`} />
                    <span>Shop</span>
                  </Link>
                  <Link 
                    href="/destination-matcher" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/destination-matcher" 
                        ? "bg-homa-blue/10 text-homa-blue" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <MapPin className={`h-4 w-4 ${currentLocation === "/destination-matcher" ? "text-homa-blue" : "text-gray-400"}`} />
                    <span>Find Your Match</span>
                  </Link>
                  <Link 
                    href="/local-destinations" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/local-destinations" 
                        ? "bg-homa-blue/10 text-homa-blue" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <MapPinned className={`h-4 w-4 ${currentLocation === "/local-destinations" ? "text-homa-blue" : "text-gray-400"}`} />
                    <span>US Destinations</span>
                  </Link>
                  <Link 
                    href="/travel-resources" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/travel-resources" 
                        ? "bg-homa-blue/10 text-homa-blue" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <DollarSign className={`h-4 w-4 ${currentLocation === "/travel-resources" ? "text-homa-blue" : "text-gray-400"}`} />
                    <span>Travel Resources</span>
                  </Link>

                  <Link 
                    href="/flight-tracker" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/flight-tracker" 
                        ? "bg-homa-blue/10 text-homa-blue" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Plane className={`h-4 w-4 ${currentLocation === "/flight-tracker" ? "text-homa-blue" : "text-gray-400"}`} />
                    <span>Flight Tracker</span>
                  </Link>
                  <Link 
                    href="/mood-board" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/mood-board" 
                        ? "bg-homa-blue/10 text-homa-blue" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Layout className={`h-4 w-4 ${currentLocation === "/mood-board" ? "text-homa-blue" : "text-gray-400"}`} />
                    <span>Mood Boards</span>
                  </Link>
                  <Link 
                    href="/budget-calculator" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/budget-calculator" 
                        ? "bg-homa-blue/10 text-homa-blue" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <DollarSign className={`h-4 w-4 ${currentLocation === "/budget-calculator" ? "text-homa-blue" : "text-gray-400"}`} />
                    <span>Budget Calculator</span>
                  </Link>
                  <Link 
                    href="/about" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                      currentLocation === "/about" 
                        ? "bg-homa-blue/10 text-homa-blue" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Info className={`h-4 w-4 ${currentLocation === "/about" ? "text-homa-blue" : "text-gray-400"}`} />
                    <span>About</span>
                  </Link>
                  <div className="border-t border-gray-100 my-3"></div>
                  
                  {user ? (
                    <>
                      <div className="flex items-center px-3 py-2 bg-homa-blue/10 rounded-md text-homa-blue">
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">{user.username}</span>
                      </div>
                      <Link href="/profile" className="ml-5 text-xs text-gray-600 hover:text-homa-blue transition-colors">
                        Profile
                      </Link>
                      <Link href="/bookings" className="ml-5 text-xs text-gray-600 hover:text-homa-blue transition-colors">
                        My Bookings
                      </Link>
                      <Link href="/favorites" className="ml-5 text-xs text-gray-600 hover:text-homa-blue transition-colors">
                        Favorites
                      </Link>
                      <button 
                        className="flex items-center mt-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/auth" className="flex items-center px-3 py-2 text-sm text-homa-blue bg-homa-blue/10 hover:bg-homa-blue/20 rounded-md transition-colors">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                      <Link href="/auth?register=true" className="block">
                        <Button className="w-full text-sm bg-homa-blue hover:bg-homa-blue/90">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  <Link href="/cart" className="flex items-center px-3 py-2 mt-2 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Cart {cartCount > 0 && (
                      <span className="ml-1 bg-homa-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Search Bar (conditionally rendered) */}
        {isSearchOpen && (
          <div className="py-3 border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations, guides, and articles..."
                className="w-full px-4 py-2.5 pr-10 text-sm border rounded-md bg-homa-blue/5 focus:border-homa-blue/20 focus:outline-none"
                autoFocus
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-homa-blue"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
