import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';
import { Helmet } from 'react-helmet';
import { GrayInput } from '@/components/ui/gray-input';
import { GraySelect, GraySelectContent, GraySelectItem, GraySelectTrigger, GraySelectValue } from '@/components/ui/gray-select';
import { Search, BookOpen } from 'lucide-react';
import { AdSection } from '@/components/ads';

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter products based on search query
  const filteredProducts = products?.filter(product => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  // Sort products
  const sortedProducts = React.useMemo(() => {
    if (!filteredProducts) return [];
    
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          // Since we don't have date field in products, we'll just use ID as proxy for "newest"
          return b.id - a.id;
        default: // 'featured'
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
    });
  }, [filteredProducts, sortBy]);

  return (
    <>
      <Helmet>
        <title>Travel Guides & Resources | Homa Travel Co.</title>
        <meta name="description" content="Curated guides and tools to help you plan your perfect trip with Homa Travel Co." />
      </Helmet>
      
      <div className="bg-[#f0f5f7] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Travel Guides & Planning Tools</h1>
            <p className="text-neutral-600">Curated guides and tools to help you plan your perfect trip.</p>
          </div>
          
          {/* Search and Sort Bar */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <GrayInput
                  type="text"
                  placeholder="Search guides and resources..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
              
              <div className="w-full md:w-48">
                <GraySelect value={sortBy} onValueChange={setSortBy}>
                  <GraySelectTrigger>
                    <GraySelectValue placeholder="Sort by" />
                  </GraySelectTrigger>
                  <GraySelectContent>
                    <GraySelectItem value="featured">Featured</GraySelectItem>
                    <GraySelectItem value="price-low">Price: Low to High</GraySelectItem>
                    <GraySelectItem value="price-high">Price: High to Low</GraySelectItem>
                    <GraySelectItem value="rating">Highest Rated</GraySelectItem>
                    <GraySelectItem value="newest">Newest</GraySelectItem>
                  </GraySelectContent>
                </GraySelect>
              </div>
            </div>
          </div>
          
          {/* Banner ad above products */}
          <div className="mb-8">
            <AdSection 
              size="leaderboard" 
              clientId="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
              slotId="XXXXXXXXXX" // Replace with your ad unit ID
            />
          </div>
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-md h-80">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-5">
                    <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
              Failed to load products. Please try again later.
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <BookOpen className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-neutral-600 mb-4">We couldn't find any products matching your search.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-primary font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              {/* First row of products */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedProducts.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Ad between product rows */}
              {sortedProducts.length > 4 && (
                <div className="my-8">
                  <AdSection 
                    size="banner" 
                    clientId="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
                    slotId="XXXXXXXXXX" // Replace with your ad unit ID
                  />
                </div>
              )}
              
              {/* Remaining products */}
              {sortedProducts.length > 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  {sortedProducts.slice(4).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              
              {/* Rectangle ad at the bottom */}
              <div className="mt-12 flex justify-center">
                <AdSection 
                  size="rectangle" 
                  clientId="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
                  slotId="XXXXXXXXXX" // Replace with your ad unit ID
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
