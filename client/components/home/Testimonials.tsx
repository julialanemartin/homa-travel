import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Testimonial } from '@/lib/types.js';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 60) return '1 month ago';
    if (diffDays < 90) return '2 months ago';
    if (diffDays < 120) return '3 months ago';
    
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Traveler Stories</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Hear from fellow travelers who found their perfect destinations using our matching service.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-[#f0f5f7] rounded-xl p-6 shadow-md h-60">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-[#dce6ea] rounded-full mr-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#dce6ea] rounded w-24"></div>
                    <div className="h-3 bg-[#dce6ea] rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#dce6ea] rounded"></div>
                  <div className="h-4 bg-[#dce6ea] rounded"></div>
                  <div className="h-4 bg-[#dce6ea] rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
            Failed to load testimonials. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-[#f0f5f7] rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.imageUrl} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <div className="flex text-accent">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'fill-accent text-accent' : 'text-neutral-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-600 mb-3">{testimonial.content}</p>
                <div className="flex items-center flex-wrap">
                  {testimonial.destination && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mr-2">
                      Matched with {testimonial.destination}
                    </span>
                  )}
                  {testimonial.productId && (
                    <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full mr-2">
                      Purchased Guide
                    </span>
                  )}
                  <span className="text-xs text-neutral-500">{formatDate(testimonial.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
