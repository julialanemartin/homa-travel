import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Destination } from '@/lib/types.js';
import DestinationCard from '@/components/destinations/DestinationCard.js';
import DestinationCarousel from '@/components/home/DestinationCarousel.js';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button.js';

export default function FeaturedDestinations() {
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  // Take only the first 3 destinations for the standard featured section
  const featuredDestinations = destinations?.slice(0, 3);

  return (
    <section className="py-24 bg-[#f0f5f7]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-amber-600 font-medium">Discover the world with us</span>
            </div>
            <h2 className="text-3xl font-medium text-gray-900 mb-3">Featured Destinations</h2>
            <p className="text-gray-600 max-w-2xl">Explore our curated selection of stunning locations.</p>
          </div>
          <Link href="/destinations" className="hidden md:flex items-center text-gray-900 hover:text-gray-700 mt-4 md:mt-0">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        {/* Destination Discovery Carousel */}
        <div className="mb-16">
          <DestinationCarousel />
          <div className="flex justify-center mt-6">
            <Link href="/destination-showcase">
              <Button
                className="group text-white hover:opacity-90 bg-homa-blue"
              >
                Explore Full Showcase
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Traditional Card Layout */}
        <div className="mt-20">
          <h3 className="text-2xl font-medium text-gray-900 mb-8">More Popular Destinations</h3>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="animate-pulse">
                  <div className="aspect-[3/2] bg-[#f0f5f7] mb-4"></div>
                  <div className="h-6 bg-[#f0f5f7] rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-[#f0f5f7] rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 text-gray-500">
              Failed to load destinations. Please try again later.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredDestinations?.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
              
              <div className="md:hidden flex justify-center mt-10">
                <Link href="/destinations" className="text-gray-900 hover:text-gray-700 flex items-center">
                  View all destinations <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
