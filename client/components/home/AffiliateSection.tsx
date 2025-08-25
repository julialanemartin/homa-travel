import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AffiliateProduct } from '@/components/affiliate';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export default function AffiliateSection() {
  return (
    <section className="py-14 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-heading mb-4">Travel Essentials</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our team-tested recommendations for gear and services that enhance your travel experience.
          </p>
          <div className="text-xs text-neutral-500 mt-2">
            <span>Disclosure: Products feature affiliate links that support our work.</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AffiliateProduct
            title="Universal Travel Adapter"
            imageUrl="https://images.unsplash.com/photo-1583921048886-543fb6a366b2?auto=format&q=75&fit=crop&w=600"
            price={{ amount: 24.99, currency: 'USD', originalAmount: 34.99 }}
            platform="amazon"
            url="https://www.amazon.com/Travel-Adapter-Universal-International-European/dp/B07DMLXF9F/"
            affiliateId="homatravel-20"
          />
          
          <AffiliateProduct
            title="Bose QuietComfort Earbuds"
            imageUrl="https://images.unsplash.com/photo-1608156639585-b3a032e39d60?auto=format&q=75&fit=crop&w=600"
            price={{ amount: 199.99, currency: 'USD', originalAmount: 249.99 }}
            platform="amazon"
            url="https://www.amazon.com/Bose-QuietComfort-Noise-Cancelling-Earbuds/dp/B08C4KWM9T/"
            affiliateId="homatravel-20"
          />
          
          <AffiliateProduct
            title="World Nomads Insurance"
            imageUrl="https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&q=75&fit=crop&w=600"
            description="Comprehensive travel insurance"
            price={{ amount: 149, currency: 'USD' }}
            platform="worldnomads"
            url="https://www.worldnomads.com/travel-insurance/"
            callToAction="Get a Quote"
            affiliateId="your_worldnomads_id"
          />
          
          <Card className="overflow-hidden border border-homa-blue/20 bg-gradient-to-b from-white to-gray-100">
            <div className="aspect-square overflow-hidden relative flex items-center justify-center p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-semibold text-homa-blue mb-3">40+</div>
                <h3 className="text-xl font-medium mb-2">Travel Resources</h3>
              </div>
            </div>
            
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                Gear, accommodations, insurance, and more to help you travel smarter.
              </p>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Link href="/travel-resources" className="w-full">
                <Button className="w-full bg-homa-blue hover:bg-homa-blue/90 text-white" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View All Resources
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}