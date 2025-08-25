import React from 'react';
import { Helmet } from 'react-helmet';
import StoryGenerator from '@/components/social/StoryGenerator';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useLocation } from 'wouter';
import { ArrowLeft, Share2, Instagram, Twitter, Facebook } from 'lucide-react';

export default function SocialStoryGenerator() {
  const [, setLocation] = useLocation();
  
  // Check for destination ID in URL search params
  const searchParams = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search) 
    : new URLSearchParams();
  
  const destinationId = searchParams.get('destinationId') 
    ? parseInt(searchParams.get('destinationId') as string, 10) 
    : undefined;

  return (
    <>
      <Helmet>
        <title>Social Media Story Generator | Homa Travel Co.</title>
        <meta 
          name="description" 
          content="Create eye-catching social media stories about your favorite travel destinations with AI-powered captions and visual templates."
        />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation('/')} 
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex space-x-2">
                <span className="bg-gradient-primary text-white text-xs font-medium px-2.5 py-0.5 rounded">AI-Powered</span>
                <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">Social Media</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">Social Media Story Generator</h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl">
              Create eye-catching stories for Instagram, Facebook, Twitter, and TikTok based on your favorite travel destinations.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Tool
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Instagram className="h-4 w-4 text-primary" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Twitter className="h-4 w-4 text-primary" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Facebook className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </div>
        
        <div className="mb-8 p-4 border border-gray-200 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Select a travel destination from our curated collection</li>
            <li>Choose your mood, travel style, and target social platform</li>
            <li>Our AI will generate custom captions, hashtags, and visual styling recommendations</li>
            <li>Customize the content and image style to match your preferences</li>
            <li>Download your story image or share it directly to social media</li>
          </ol>
        </div>
        
        <StoryGenerator initialDestinationId={destinationId} />
        
        <div className="mt-16 bg-gray-50 rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Why Share Your Travel Stories?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Inspire Others</h3>
              <p className="text-gray-600">
                Your travel experiences can inspire friends and followers to explore new destinations and cultures.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Build Your Brand</h3>
              <p className="text-gray-600">
                Consistently sharing high-quality travel content helps build your personal brand as a traveler or influencer.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Preserve Memories</h3>
              <p className="text-gray-600">
                Create beautiful digital mementos of your journeys that you can revisit for years to come.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">
            Ready to explore more travel destinations?
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/destinations">Browse Destinations</Link>
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <Link href="/destination-matcher">Find Your Match</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}