import React from 'react';
import Hero from '@/components/home/Hero';
import DestinationMatcher from '@/components/home/DestinationMatcher';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import BlogSection from '@/components/home/BlogSection';
import DigitalProducts from '@/components/home/DigitalProducts';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import AffiliateSection from '@/components/home/AffiliateSection';

import { Helmet } from 'react-helmet';
import { AdSection } from '@/components/ads';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Homa Travel Co. - Discover Your Perfect Destination</title>
        <meta name="description" content="Find travel inspiration, expert guides, and adventures tailored to your preferences with Homa Travel Co." />
      </Helmet>
      
      <Hero />
      <DestinationMatcher />
      
      {/* Leaderboard ad after destination matcher section */}
      <div className="py-8 bg-homa-blue">
        <div className="container">
          <AdSection 
            size="leaderboard" 
            clientId="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
            slotId="XXXXXXXXXX" // Replace with your ad unit ID
          />
        </div>
      </div>
      
      <FeaturedDestinations />
      <BlogSection />
      
      {/* Rectangle ad between blog and products */}
      <div className="py-8 bg-homa-blue">
        <div className="container flex justify-center">
          <AdSection 
            size="rectangle" 
            clientId="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
            slotId="XXXXXXXXXX" // Replace with your ad unit ID
          />
        </div>
      </div>
      
      <DigitalProducts />
      <AffiliateSection />
      <Testimonials />
      
      {/* Wide skyscraper ad before newsletter with matching background */}
      <div className="py-8 bg-homa-blue">
        <div className="container flex justify-center">
          <AdSection 
            size="wide-skyscraper" 
            clientId="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
            slotId="XXXXXXXXXX" // Replace with your ad unit ID
          />
        </div>
      </div>
      
      <Newsletter />
    </>
  );
}
