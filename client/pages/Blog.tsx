import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types';
import BlogCard from '@/components/blog/BlogCard';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { GrayInput } from '@/components/ui/gray-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Tag } from 'lucide-react';
import { AdSection } from '@/components/ads';

export default function Blog() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  
  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const tagParam = params.get('tag');
    
    if (tagParam) setSelectedTag(tagParam);
  }, [location]);

  // Fetch blog posts
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts', selectedTag],
    queryFn: async () => {
      const url = new URL('/api/blog-posts', window.location.origin);
      if (selectedTag) url.searchParams.append('tags', selectedTag);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  // Filter blog posts based on search query
  const filteredPosts = blogPosts?.filter(post => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.authorName.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Sort posts with featured first, then by date
  const sortedPosts = React.useMemo(() => {
    if (!filteredPosts) return [];
    
    return [...filteredPosts].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [filteredPosts]);

  // Extract all unique tags from blog posts
  const allTags = React.useMemo(() => {
    if (!blogPosts) return [];
    
    const tagsSet = new Set<string>();
    blogPosts.forEach(post => {
      post.tags.forEach(tag => tagsSet.add(tag));
    });
    
    return Array.from(tagsSet).sort();
  }, [blogPosts]);

  return (
    <>
      <Helmet>
        <title>Travel Blog | Homa Travel Co.</title>
        <meta name="description" content="Travel tips, stories, and guides from our community of experienced travelers." />
      </Helmet>
      
      <div className="bg-[#f0f5f7] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Travel Inspiration</h1>
            <p className="text-neutral-600">Discover travel tips, stories, and guides from our community of experienced travelers.</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <GrayInput
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
              
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag className="h-4 w-4 text-neutral-500" />
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(prev => prev === tag ? '' : tag)}
                      className="rounded-full text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Banner ad above blog posts */}
          <div className="mb-8">
            <AdSection 
              size="leaderboard" 
              clientId="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
              slotId="XXXXXXXXXX" // Replace with your ad unit ID
            />
          </div>
          
          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-md h-96">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
              Failed to load blog posts. Please try again later.
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search criteria or filters.</p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedTag('');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedPosts.slice(0, 3).map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* Rectangle ad after first row of posts */}
              {sortedPosts.length > 3 && (
                <div className="my-8 flex justify-center">
                  <AdSection 
                    size="rectangle" 
                    clientId="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
                    slotId="XXXXXXXXXX" // Replace with your ad unit ID
                  />
                </div>
              )}
              
              {sortedPosts.length > 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {sortedPosts.slice(3).map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
