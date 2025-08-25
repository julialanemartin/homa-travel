import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import useEmblaCarousel from 'embla-carousel-react';
import { Destination } from '@/lib/types';
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DestinationCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  const { data: destinations = [], isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
  });

  // Featured destinations with good images for the carousel
  const featuredDestinations = destinations?.slice(0, 5);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
    resetAutoplay();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
    resetAutoplay();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
      resetAutoplay();
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const startAutoplay = useCallback(() => {
    if (!emblaApi || autoPlayInterval) return;
    
    const interval = setInterval(() => {
      if (!emblaApi.canScrollNext()) {
        emblaApi.scrollTo(0);
      } else {
        emblaApi.scrollNext();
      }
    }, 5000); // Change slide every 5 seconds
    
    setAutoPlayInterval(interval);
  }, [emblaApi, autoPlayInterval]);

  const stopAutoplay = useCallback(() => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  }, [autoPlayInterval]);

  const resetAutoplay = useCallback(() => {
    stopAutoplay();
    if (isAutoPlaying) startAutoplay();
  }, [stopAutoplay, startAutoplay, isAutoPlaying]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    
    // Start autoplay when component mounts
    startAutoplay();
    
    return () => {
      emblaApi.off('select', onSelect);
      stopAutoplay();
    };
  }, [emblaApi, onSelect, startAutoplay, stopAutoplay]);

  if (isLoading || featuredDestinations.length === 0) {
    return (
      <div className="h-[600px] bg-[#f0f5f7] rounded-lg flex items-center justify-center text-gray-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-300 rounded-full animate-spin mb-4"></div>
          <p>Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-xl">
      {/* Main carousel container */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {featuredDestinations.map((destination, index) => (
            <div key={destination.id} className="embla__slide relative flex-[0_0_100%] min-w-0">
              <div className="relative h-[600px] overflow-hidden">
                {/* Background image with gradient overlay */}
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="border-white/40 text-white bg-black/30 backdrop-blur-sm">
                      Featured Destination
                    </Badge>
                    {destination.continent && (
                      <Badge variant="outline" className="ml-2 border-white/40 text-white bg-black/30 backdrop-blur-sm">
                        {destination.continent}
                      </Badge>
                    )}
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-2">{destination.name}</h2>
                  
                  <div className="flex items-center mb-4 text-white/80">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{destination.continent || 'Worldwide'}</span>
                  </div>
                  
                  <p className="text-lg text-white/90 max-w-lg mb-6 line-clamp-2">
                    {destination.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {destination.tags?.slice(0, 4).map((tag, i) => (
                      <Badge key={i} className="bg-white/20 hover:bg-white/30 text-white border-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Link href={`/destinations/${destination.id}`}>
                    <Button 
                      className="group text-white hover:opacity-90 bg-homa-blue"
                      size="lg"
                    >
                      Explore Destination
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
        onClick={scrollPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
        onClick={scrollNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === selectedIndex
                ? 'bg-homa-blue'
                : 'bg-homa-blue/30 hover:bg-homa-blue/50'
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}