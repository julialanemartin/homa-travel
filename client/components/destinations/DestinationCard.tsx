import React, { useState } from 'react';
import { Link } from 'wouter';
import { Destination } from '@/lib/types';
import { Heart, Star, MapPin } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Determine color based on continent
  const getBadgeClasses = (continent: string) => {
    switch(continent.toLowerCase()) {
      case 'europe': return 'badge-blue';
      case 'asia': return 'badge-emerald';
      case 'africa': return 'badge-amber';
      case 'north america': return 'badge-blue';
      case 'south america': return 'badge-rose';
      case 'oceania': return 'badge-blue';
      default: return 'badge-blue';
    }
  };

  // Determine shadow based on continent
  const getShadowClasses = (continent: string) => {
    switch(continent.toLowerCase()) {
      case 'europe': return 'shadow-blue';
      case 'asia': return 'shadow-green';
      case 'africa': 
      case 'south america': 
      case 'oceania': return 'shadow-amber';
      default: return 'shadow-blue';
    }
  };

  return (
    <div className="group">
      <Link href={`/destinations/${destination.id}`}>
        <div className="space-y-3">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg shadow-minimal hover:shadow-md transition-shadow duration-300">
            <div className={`absolute inset-0 ${getShadowClasses(destination.continent)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <img 
              src={destination.imageUrl} 
              alt={destination.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start">
              <span className={`badge ${getBadgeClasses(destination.continent)} backdrop-blur-sm`}>
                {destination.continent}
              </span>
              <button 
                onClick={toggleFavorite}
                className="bg-white/90 rounded-full p-1.5 shadow-sm transition-transform group-hover:scale-110"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  className={`${isFavorite ? 'fill-homa-blue text-homa-blue' : 'text-gray-600'} w-4 h-4`} 
                />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-900 font-medium">{destination.name}</h3>
                <div className="flex items-center text-gray-500 text-xs mt-0.5">
                  <MapPin className="w-3 h-3 mr-1" />
                  {destination.country}
                </div>
              </div>
              <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded">
                <Star className="fill-amber-500 text-amber-500 w-3 h-3" />
                <span className="ml-1 text-xs font-medium text-amber-700">{destination.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2">{destination.description}</p>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {destination.tags.slice(0, 3).map((tag, index) => {
                // Alternate tag colors with Homa blue as the first option
                const tagClasses = [
                  'bg-homa-blue/10 text-homa-blue', 
                  'bg-emerald-50 text-emerald-700',
                  'bg-amber-50 text-amber-700'
                ];
                return (
                  <span 
                    key={index} 
                    className={`text-xs px-2 py-0.5 rounded-full ${tagClasses[index % tagClasses.length]}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
