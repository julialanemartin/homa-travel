import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/lib/types.js';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import BlogCard from '@/components/blog/BlogCard.js';

export default function BlogSection() {
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  const featuredPost = blogPosts?.find(post => post.featured);
  const regularPosts = blogPosts?.filter(post => !post.featured).slice(0, 2);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Travel Inspiration</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Discover travel tips, stories, and guides from our community of experienced travelers.
          </p>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-neutral-100 rounded-xl h-96"></div>
              <div className="bg-neutral-100 rounded-xl h-96"></div>
              <div className="hidden lg:block bg-neutral-100 rounded-xl h-96"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
            Failed to load blog posts. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Featured Blog Post */}
              {featuredPost && (
                <div className="lg:col-span-2 bg-neutral-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <Link href={`/blog/${featuredPost.id}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="relative h-64 lg:h-full">
                        <img 
                          src={featuredPost.imageUrl} 
                          alt={featuredPost.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-homa-blue text-white text-xs uppercase font-bold px-3 py-1 rounded-full">
                          Featured
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="mb-2 flex items-center">
                          <img 
                            src={featuredPost.authorImageUrl} 
                            alt={featuredPost.authorName} 
                            className="h-8 w-8 rounded-full object-cover mr-2"
                          />
                          <span className="text-sm text-neutral-600">
                            By {featuredPost.authorName} • {format(new Date(featuredPost.publishedAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <h3 className="font-heading font-semibold text-xl md:text-2xl mb-3">{featuredPost.title}</h3>
                        <p className="text-neutral-600 mb-4">
                          {featuredPost.content.length > 120 
                            ? featuredPost.content.substring(0, 120) + '...' 
                            : featuredPost.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featuredPost.tags.map((tag, index) => (
                            <span key={index} className="bg-neutral-200 text-neutral-700 text-xs px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="inline-flex items-center font-medium text-homa-blue hover:underline">
                          Read Article <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              
              {/* Regular Blog Posts */}
              {regularPosts?.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            
            <div className="flex justify-center mt-10">
              <Button 
                asChild
                className="group text-white hover:opacity-90 bg-homa-blue"
              >
                <Link href="/blog">
                  Browse All Articles <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
