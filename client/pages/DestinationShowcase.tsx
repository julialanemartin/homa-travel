import React from 'react';
import { Helmet } from 'react-helmet';
import DestinationCarousel from '@/components/home/DestinationCarousel';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function DestinationShowcase() {
  return (
    <>
      <Helmet>
        <title>Destination Showcase | Homa Travel Co.</title>
        <meta name="description" content="Explore our featured destinations with immersive visuals and detailed information." />
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8 flex items-center">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4">Destination Showcase</h1>
        </div>
        
        <div className="mb-12">
          <DestinationCarousel />
        </div>
        
        <div className="prose max-w-3xl mx-auto mb-12">
          <h2>About Our Destination Showcase</h2>
          <p>
            The Homa Travel Co. Destination Showcase features our specially curated collection of premium travel destinations from around the world. Each destination is carefully selected by our travel experts for its exceptional experiences, breathtaking landscapes, cultural richness, and unique attractions.
          </p>
          <p>
            Our animated carousel provides an immersive preview of these destinations, allowing you to explore the visual beauty of each location before diving deeper into detailed guides, local insights, and travel planning resources.
          </p>
          
          <h3>Features of our Showcase</h3>
          <ul>
            <li>High-resolution imagery that captures the essence of each destination</li>
            <li>Curated information including location details, highlights, and key attractions</li>
            <li>Categorized tags to help you identify destinations matching your preferences</li>
            <li>Direct links to comprehensive destination guides and booking resources</li>
            <li>Regular updates featuring seasonal destinations and special travel opportunities</li>
          </ul>
          
          <p>
            Our Destination Showcase is designed to inspire your next journey while providing practical information to help you plan your perfect trip. Explore the carousel above and discover where your next adventure might take you!
          </p>
        </div>
      </div>
    </>
  );
}