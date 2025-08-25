import React from 'react';
import { Helmet } from 'react-helmet';
import { BookingWidget, AffiliateProduct, AffiliateLink } from '@/components/affiliate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AffiliateShowcase() {
  return (
    <>
      <Helmet>
        <title>Travel Resources | Homa Travel Co.</title>
        <meta name="description" content="Curated travel resources and recommendations to enhance your journey." />
      </Helmet>
      
      <div className="bg-[#f0f5f7] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Travel Resources</h1>
            <p className="text-neutral-600">Curated recommendations to enhance your travel experience.</p>
            <p className="text-sm text-neutral-500 mt-2">
              <span className="italic">Disclosure:</span> This page contains affiliate links. We may earn a commission if you make a purchase through these links.
            </p>
          </div>
          
          <Tabs defaultValue="accommodations">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-4 mb-8">
              <TabsTrigger value="accommodations">Where to Stay</TabsTrigger>
              <TabsTrigger value="gear">Travel Gear</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="safety">Safety & Advisories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accommodations">
              <h2 className="text-2xl font-semibold mb-6">Recommended Accommodations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BookingWidget
                  title="Villa Santorini Sunset"
                  description="Stunning villa with private infinity pool and Caldera views"
                  imageUrl="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&q=75&fit=crop&w=600"
                  price={{ amount: 249, currency: 'USD', period: 'night' }}
                  rating={{ score: 4.9, count: 287 }}
                  platform="booking"
                  url="https://www.booking.com/hotel/gr/villa-santorini.html"
                  affiliateId="your_booking_id"
                />
                
                <BookingWidget
                  title="Luxury Beachfront Bali Villa"
                  description="Private beach access with full staff and tropical garden"
                  imageUrl="https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&q=75&fit=crop&w=600"
                  price={{ amount: 325, currency: 'USD', period: 'night' }}
                  rating={{ score: 4.8, count: 156 }}
                  platform="airbnb"
                  url="https://www.airbnb.com/rooms/12345678"
                  affiliateId="your_airbnb_id"
                />
                
                <BookingWidget
                  title="Paris Boutique Hotel"
                  description="Charming hotel in the heart of Saint-Germain"
                  imageUrl="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&q=75&fit=crop&w=600"
                  price={{ amount: 189, currency: 'EUR', period: 'night' }}
                  rating={{ score: 4.7, count: 412 }}
                  platform="expedia"
                  url="https://www.expedia.com/Paris-Hotels-Boutique-Hotel.h12345.Hotel-Information"
                  affiliateId="your_expedia_id"
                />
              </div>
              
              <div className="mt-10 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Get the best hotel deals</h3>
                <p className="mb-4">
                  Looking for the best price on accommodations? We recommend using{' '}
                  <AffiliateLink
                    href="https://www.kayak.com/hotels"
                    platform="kayak"
                    tracking={{ ref: 'homatravel' }}
                  >
                    KAYAK
                  </AffiliateLink>
                  {' '}to compare prices across all major booking sites.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="gear">
              <h2 className="text-2xl font-semibold mb-6">Essential Travel Gear</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AffiliateProduct
                  title="Osprey Farpoint 40 Travel Backpack"
                  imageUrl="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&q=75&fit=crop&w=600"
                  price={{ amount: 159.95, currency: 'USD', originalAmount: 179.95 }}
                  platform="amazon"
                  url="https://www.amazon.com/Osprey-Farpoint-Travel-Backpack-Volcanic/dp/B014EBLI88/"
                  affiliateId="homatravel-20"
                />
                
                <AffiliateProduct
                  title="Bose QuietComfort 45 Noise Cancelling Headphones"
                  imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&q=75&fit=crop&w=600"
                  price={{ amount: 279, currency: 'USD', originalAmount: 329 }}
                  platform="amazon"
                  url="https://www.amazon.com/Bose-QuietComfort-Wireless-Cancelling-Headphones/dp/B098FKXT8L/"
                  affiliateId="homatravel-20"
                />
                
                <AffiliateProduct
                  title="Patagonia Black Hole 55L Duffel Bag"
                  imageUrl="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&q=75&fit=crop&w=600"
                  price={{ amount: 139, currency: 'USD' }}
                  platform="rei"
                  url="https://www.rei.com/product/118825/patagonia-black-hole-duffel-55l"
                  affiliateId="your_rei_id"
                />
                
                <AffiliateProduct
                  title="Universal Travel Adapter with USB Ports"
                  imageUrl="https://images.unsplash.com/photo-1583921048886-543fb6a366b2?auto=format&q=75&fit=crop&w=600"
                  price={{ amount: 24.99, currency: 'USD', originalAmount: 39.99 }}
                  platform="amazon"
                  url="https://www.amazon.com/Travel-Adapter-Universal-International-European/dp/B07DMLXF9F/"
                  affiliateId="homatravel-20"
                />
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Our #1 Travel Camera Pick</CardTitle>
                    <CardDescription>Perfect for travel photography</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&q=75&fit=crop&w=600" 
                        alt="Camera"
                        className="mx-auto h-48 object-contain"
                      />
                    </div>
                    <p className="mb-4 text-sm">The Sony Alpha a6400 is our top recommendation for travelers who want professional quality photos without the bulk.</p>
                    <AffiliateLink
                      href="https://www.amazon.com/Sony-Alpha-a6400-Mirrorless-Camera/dp/B07MTWVN3M/"
                      platform="amazon"
                      tracking={{ tag: 'homatravel-20' }}
                      className="text-center block font-medium"
                    >
                      Check price on Amazon
                    </AffiliateLink>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Best Packing Cubes</CardTitle>
                    <CardDescription>Stay organized while traveling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&q=75&fit=crop&w=600" 
                        alt="Packing cubes"
                        className="mx-auto h-48 object-contain"
                      />
                    </div>
                    <p className="mb-4 text-sm">Compression packing cubes save space and keep your luggage perfectly organized throughout your trip.</p>
                    <AffiliateLink
                      href="https://www.amazon.com/Eagle-Creek-Pack-Compression-Black/dp/B00F9S87MA/"
                      platform="amazon"
                      tracking={{ tag: 'homatravel-20' }}
                      className="text-center block font-medium"
                    >
                      View recommended set
                    </AffiliateLink>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Tech Essentials</CardTitle>
                    <CardDescription>Stay connected anywhere</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&q=75&fit=crop&w=600" 
                        alt="Travel tech"
                        className="mx-auto h-48 object-contain"
                      />
                    </div>
                    <p className="mb-4 text-sm">From portable chargers to compact laptops, check out our complete guide to essential travel tech.</p>
                    <AffiliateLink
                      href="https://www.amazon.com/s?k=travel+tech+essentials"
                      platform="amazon"
                      tracking={{ tag: 'homatravel-20' }}
                      className="text-center block font-medium"
                    >
                      Browse travel tech
                    </AffiliateLink>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="insurance">
              <h2 className="text-2xl font-semibold mb-6">Travel Insurance</h2>
              
              <Card className="mb-8">
                <CardHeader className="pb-2">
                  <CardTitle>Why You Need Travel Insurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Travel insurance is essential for protecting your trip investment and health while abroad. 
                    It can cover emergency medical expenses, trip cancellation, lost luggage, and more.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-neutral-50 p-4 rounded-lg text-center">
                      <h3 className="font-semibold mb-2">Medical Emergencies</h3>
                      <p className="text-sm mb-4">Coverage for hospital stays, emergency treatment, and evacuation.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg text-center">
                      <h3 className="font-semibold mb-2">Trip Cancellation</h3>
                      <p className="text-sm mb-4">Reimbursement if you need to cancel for covered reasons.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg text-center">
                      <h3 className="font-semibold mb-2">Lost Belongings</h3>
                      <p className="text-sm mb-4">Protection for your luggage, gear, and personal items.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>World Nomads Travel Insurance</CardTitle>
                    <CardDescription>Perfect for adventurous travelers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 mb-4 space-y-2 text-sm">
                      <li>Coverage for 200+ adventure activities</li>
                      <li>24/7 emergency assistance</li>
                      <li>Coverage for travel to almost all countries</li>
                      <li>Highly recommended for backpackers and long-term travelers</li>
                    </ul>
                    <AffiliateProduct
                      title="World Nomads Explorer Plan"
                      imageUrl="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&q=75&fit=crop&w=600"
                      description="Comprehensive coverage for adventurous travelers"
                      price={{ amount: 149, currency: 'USD' }}
                      platform="worldnomads"
                      url="https://www.worldnomads.com/travel-insurance/"
                      callToAction="Get a Quote"
                      affiliateId="your_worldnomads_id"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>SafetyWing Insurance</CardTitle>
                    <CardDescription>Ideal for digital nomads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 mb-4 space-y-2 text-sm">
                      <li>Subscription-based model you can buy while traveling</li>
                      <li>Coverage in your home country for limited periods</li>
                      <li>Affordable monthly payments</li>
                      <li>Perfect for remote workers and digital nomads</li>
                    </ul>
                    <AffiliateProduct
                      title="SafetyWing Nomad Insurance"
                      imageUrl="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&q=75&fit=crop&w=600"
                      description="Flexible insurance for location-independent professionals"
                      price={{ amount: 42, currency: 'USD', period: 'month' }}
                      platform="custom"
                      url="https://safetywing.com/nomad-insurance"
                      callToAction="Learn More"
                      affiliateId="your_safetywing_id"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-10 bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Compare Travel Insurance Options</h3>
                <p className="mb-4">
                  Not sure which insurance is right for you? We recommend comparing multiple providers to find the best coverage for your specific trip.
                </p>
                <AffiliateLink
                  href="https://www.insuremytrip.com/"
                  platform="custom"
                  tracking={{ ref: 'homatravel' }}
                  className="font-medium"
                >
                  Compare insurance quotes
                </AffiliateLink>
              </div>
            </TabsContent>
            
            <TabsContent value="safety">
              <h2 className="text-2xl font-semibold mb-6">Travel Safety & Advisories</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-2xl mr-3">🇺🇸</span>
                      U.S. State Department Travel Advisories
                    </CardTitle>
                    <CardDescription>Official travel warnings and safety information for U.S. citizens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm">
                      Stay informed about current safety conditions, security threats, and travel recommendations 
                      for destinations worldwide. The State Department provides up-to-date travel advisories 
                      with safety levels from 1 (Exercise Normal Precautions) to 4 (Do Not Travel).
                    </p>
                    <div className="space-y-3">
                      <a 
                        href="https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#2d8a9a] text-white text-center py-2 px-4 rounded-lg hover:bg-[#2d8a9a]/90 transition-colors font-medium"
                      >
                        View All Travel Advisories
                      </a>
                      <a 
                        href="https://travel.state.gov/content/travel/en/international-travel/before-you-go/travelers-checklist.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-amber-600 text-white text-center py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                      >
                        Traveler's Checklist
                      </a>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-2xl mr-3">🌍</span>
                      Additional Safety Resources
                    </CardTitle>
                    <CardDescription>International safety and health information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">CDC Travel Health Notices</h4>
                        <p className="text-sm text-neutral-600 mb-2">Health-related travel recommendations and outbreak information</p>
                        <a 
                          href="https://wwwnc.cdc.gov/travel/notices"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2d8a9a] hover:underline font-medium"
                        >
                          View CDC Travel Notices →
                        </a>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">STEP Registration</h4>
                        <p className="text-sm text-neutral-600 mb-2">Register with the U.S. Embassy for safety updates while abroad</p>
                        <a 
                          href="https://step.state.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2d8a9a] hover:underline font-medium"
                        >
                          Register for STEP →
                        </a>
                      </div>
                      

                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  Understanding Travel Advisory Levels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-800 mb-2">Level 1</div>
                    <div className="text-sm font-semibold text-green-700">Exercise Normal Precautions</div>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-800 mb-2">Level 2</div>
                    <div className="text-sm font-semibold text-yellow-700">Exercise Increased Caution</div>
                  </div>
                  <div className="bg-orange-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-800 mb-2">Level 3</div>
                    <div className="text-sm font-semibold text-orange-700">Reconsider Travel</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-800 mb-2">Level 4</div>
                    <div className="text-sm font-semibold text-red-700">Do Not Travel</div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-4 text-center">
                  Always check the latest advisories before traveling and register with STEP for updates while abroad.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}