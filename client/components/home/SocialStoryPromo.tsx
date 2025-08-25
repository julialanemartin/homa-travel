import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Camera, Share2, Sparkles, TrendingUp } from 'lucide-react';

export default function SocialStoryPromo() {
  return (
    <section className="py-16" style={{ backgroundColor: 'hsl(var(--homa-blue))' }}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white text-gray-800 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              New Feature
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Create <span className="text-white">Stunning Social Stories</span> for Your Travels
            </h2>
            
            <p className="text-lg text-white/90">
              Transform your travel experiences into eye-catching social media content with our AI-powered Story Generator. Get custom captions, hashtags, and visual recommendations in seconds.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#f0f5f7] text-gray-800 hover:bg-[#dce6ea] border border-[#dce6ea]">
                <Link href="/social-story-generator">
                  <Camera className="h-5 w-5 mr-2" />
                  Create Your Story
                </Link>
              </Button>
              
              <Button asChild size="lg" className="group text-white hover:opacity-90 bg-homa-blue">
                <Link href="/destinations">
                  <Share2 className="h-5 w-5 mr-2" />
                  Explore Destinations
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-white">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-white mr-1" />
                <span>AI-Powered Content</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-white mr-1 opacity-80" />
                <span>Custom Hashtags</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-white mr-1" />
                <span>Visual Filters</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#f0f5f7]/50 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#f0f5f7]/50 rounded-full opacity-50 blur-xl"></div>
            
            <div className="relative bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="aspect-[9/16] bg-gradient-to-br from-[#f0f5f7] to-[#dce6ea] rounded-lg overflow-hidden flex flex-col">
                <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                  <Camera className="h-12 w-12 text-gray-800 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800">Your Travel Story</h3>
                  <p className="text-gray-600 mt-2">Create custom social media content for your travel adventures</p>
                </div>
                
                <div className="bg-white p-4 rounded-t-xl border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 rounded-full bg-[#f0f5f7] flex items-center justify-center">
                        <Camera className="h-4 w-4 text-gray-800" />
                      </div>
                      <div className="h-8 w-8 rounded-full bg-[#f0f5f7] flex items-center justify-center">
                        <Share2 className="h-4 w-4 text-gray-800" />
                      </div>
                    </div>
                    <div className="bg-homa-blue text-white text-xs px-3 py-1 rounded-full">
                      Create Now
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full bg-[#f0f5f7] rounded-full"></div>
                <div className="h-4 w-3/4 bg-[#f0f5f7] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}