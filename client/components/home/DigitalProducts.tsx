import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/lib/types.js';
import ProductCard from '@/components/shop/ProductCard.js';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.js';

export default function DigitalProducts() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  return (
    <section className="py-16 bg-[#f0f5f7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Travel Guides & Resources</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Curated guides and tools to help you plan your perfect trip.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((skeleton) => (
              <div key={skeleton} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-[#f0f5f7]"></div>
                <div className="p-5">
                  <div className="h-5 bg-[#f0f5f7] rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-[#f0f5f7] rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-[#f0f5f7] rounded w-1/4"></div>
                    <div className="h-8 bg-[#f0f5f7] rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="flex justify-center mt-10">
              <Button
                asChild
                variant="outline"
                className="inline-flex items-center bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                <Link href="/shop">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
