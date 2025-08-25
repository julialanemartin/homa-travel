import React from 'react';
import { Link } from 'wouter';
import { BlogPost } from '@/lib/types';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="bg-neutral-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.id}`}>
        <div className="relative h-48">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center">
            <img 
              src={post.authorImageUrl || 'https://via.placeholder.com/40'} 
              alt={post.authorName} 
              className="h-8 w-8 rounded-full object-cover mr-2"
            />
            <span className="text-sm text-neutral-600">
              By {post.authorName} • {format(new Date(post.publishedAt), 'MMM d, yyyy')}
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg mb-3">{post.title}</h3>
          <p className="text-neutral-600 text-sm mb-4">
            {post.content.length > 100 
              ? post.content.substring(0, 100) + '...' 
              : post.content}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-neutral-200 text-neutral-700 text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-homa-blue font-medium text-sm hover:underline">Read</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
