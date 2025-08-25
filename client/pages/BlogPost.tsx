import React from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BlogPost as BlogPostType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';

export default function BlogPost() {
  // Get blog post ID from URL
  const [match, params] = useRoute('/blog/:id');
  const id = match ? Number(params.id) : null;

  // Fetch blog post
  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog-posts/${id}`],
    enabled: !!id,
  });

  // Fetch related posts (posts with same tags)
  const { data: relatedPosts } = useQuery<BlogPostType[]>({
    queryKey: ['/api/blog-posts', post?.tags.join(',')],
    enabled: !!post && post.tags.length > 0,
    queryFn: async () => {
      if (!post) return [];
      const url = new URL('/api/blog-posts', window.location.origin);
      url.searchParams.append('tags', post.tags.join(','));
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Filter out the current post
      return data.filter((p: BlogPostType) => p.id !== post.id).slice(0, 3);
    },
  });

  // Estimate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center p-8 bg-red-50 rounded-lg text-red-500">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Article</h2>
          <p className="mb-6">We couldn't load this blog post. It may have been removed or there might be a temporary issue.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate reading time
  const readingTime = calculateReadingTime(post.content);

  return (
    <>
      <Helmet>
        <title>{post.title} | Homa Travel Co. Blog</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>
      
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back to blog link */}
            <Link href="/blog">
              <Button variant="ghost" className="mb-6 pl-0 hover:pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
            
            {/* Article header */}
            <div className="mb-8">
              {post.featured && (
                <span className="inline-block bg-primary text-white text-xs uppercase font-bold px-3 py-1 rounded-full mb-4">
                  Featured
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center text-neutral-600 gap-4 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.authorName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <Link key={index} href={`/blog?tag=${tag}`}>
                    <span className="inline-flex items-center bg-neutral-200 text-neutral-700 text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-neutral-300 transition-colors">
                      <Tag className="h-3 w-3 mr-1" /> {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Featured image */}
            <div className="mb-8">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto rounded-xl object-cover shadow-md" 
              />
            </div>
            
            {/* Author info */}
            <div className="flex items-center mb-8 p-4 bg-white rounded-lg shadow-sm">
              <img 
                src={post.authorImageUrl || 'https://via.placeholder.com/40'} 
                alt={post.authorName} 
                className="h-12 w-12 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-medium">{post.authorName}</h3>
                <p className="text-sm text-neutral-600">Travel Writer & Photographer</p>
              </div>
            </div>
            
            {/* Article content */}
            <div className="prose prose-lg max-w-none mb-12">
              {/* For a real app, this would be rich HTML content or markdown */}
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {/* Related posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mt-12 border-t border-neutral-200 pt-12">
                <h3 className="text-2xl font-heading font-semibold mb-6">You Might Also Like</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(relatedPost => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={relatedPost.imageUrl} 
                            alt={relatedPost.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium mb-2 line-clamp-2">{relatedPost.title}</h4>
                          <div className="flex items-center text-sm text-neutral-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{format(new Date(relatedPost.publishedAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
