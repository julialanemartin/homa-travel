import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Compass, MapPin, Sun } from 'lucide-react';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/destinations?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="py-20 md:py-28 text-white" style={{ backgroundColor: 'hsl(var(--homa-blue))' }}>
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Compass className="h-4 w-4 mr-1.5" /> 
                Let's explore the world together
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
              Discover Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Perfect Destination</span>
            </h1>
            
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Find travel inspiration, expert guides, and adventures tailored to your preferences.
            </p>
            
            {/* Clean Explore Button */}
            <div className="mt-8">
              <Button 
                onClick={() => setLocation('/destinations')}
                className="h-12 px-8 bg-white text-homa-blue hover:bg-white/90 text-lg font-medium"
              >
                <Compass className="mr-2 h-5 w-5" /> Explore Destinations
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">Authentic Guides</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Compass className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">Smart Planning</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sun className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">Personalized Match</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-homa-blue/20 rounded-lg opacity-70 -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-homa-blue/10 rounded-lg opacity-70 -z-10"></div>
              
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl shadow-homa-blue/20">
                <img 
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Travel destination" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
