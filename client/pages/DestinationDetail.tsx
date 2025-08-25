import React from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Destination, BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet';
import { ArrowLeft, MapPin, Calendar, DollarSign, Star, Leaf, Heart, Bookmark, Share2 } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';

export default function DestinationDetail() {
  // Get destination ID from URL
  const [match, params] = useRoute('/destinations/:id');
  const id = match ? Number(params.id) : null;
  const [isFavorite, setIsFavorite] = React.useState(false);

  // Fetch destination
  const { data: destination, isLoading, error } = useQuery<Destination>({
    queryKey: [`/api/destinations/${id}`],
    enabled: !!id,
  });

  // Fetch related blog posts
  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    enabled: !!destination,
    select: (posts) => {
      if (!destination) return [];
      // Find posts that mention the destination or have matching tags
      return posts.filter(post => 
        post.title.includes(destination.name) || 
        post.content.includes(destination.name) ||
        destination.tags.some(tag => post.tags.includes(tag))
      ).slice(0, 3);
    }
  });

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-60 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center p-8 bg-red-50 rounded-lg text-red-500">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Destination</h2>
          <p className="mb-6">We couldn't load this destination. It may have been removed or there might be a temporary issue.</p>
          <Button asChild>
            <Link href="/destinations">Back to Destinations</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{destination.name}, {destination.country} | Homa Travel Co.</title>
        <meta name="description" content={destination.description} />
      </Helmet>
      
      <div className="bg-neutral-100 min-h-screen">
        {/* Hero Image */}
        <div 
          className="h-96 bg-cover bg-center relative" 
          style={{ backgroundImage: `url(${destination.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="container mx-auto px-4 h-full flex items-end">
            <div className="relative text-white pb-8">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">
                {destination.name}
              </h1>
              <div className="flex items-center text-lg">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{destination.country}, {destination.continent}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Back to destinations link */}
          <Link href="/destinations">
            <Button variant="ghost" className="pl-0 hover:pl-0 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Destinations
            </Button>
          </Link>
          
          <div className="max-w-5xl mx-auto">
            {/* Action buttons */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-2 shadow-sm">
                  <Star className="fill-accent text-accent h-5 w-5" />
                </div>
                <span className="ml-2 font-semibold text-lg">{destination.rating.toFixed(1)}</span>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleFavorite}
                  className={isFavorite ? "text-red-500" : ""}
                >
                  <Heart className={`mr-1 h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} /> 
                  {isFavorite ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-1 h-4 w-4" /> Trip Plan
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-1 h-4 w-4" /> Share
                </Button>
              </div>
            </div>
            
            {/* Destination info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-3">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Best Time to Visit</h3>
                </div>
                <div className="text-neutral-600">
                  {destination.features?.bestSeasons && Array.isArray(destination.features.bestSeasons) 
                    ? destination.features.bestSeasons.join(', ') 
                    : 'All year'}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-3">
                  <DollarSign className="h-5 w-5 text-secondary mr-2" />
                  <h3 className="font-medium">Budget Range</h3>
                </div>
                <div className="text-neutral-600">
                  {destination.features?.budget || 'Moderate'}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-3">
                  <Leaf className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-medium">Experiences</h3>
                </div>
                <div className="text-neutral-600">
                  {destination.features?.activities && Array.isArray(destination.features.activities)
                    ? destination.features.activities.join(', ')
                    : 'Various activities'}
                </div>
              </div>
            </div>
            
            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" className="mb-10">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="things-to-do">Things to Do</TabsTrigger>
                <TabsTrigger value="travel-tips">Travel Tips</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-heading font-semibold mb-4">About {destination.name}</h2>
                  <p className="text-neutral-600 mb-6">
                    {destination.description}
                    {/* Extended description would be here in a real app */}
                    <br /><br />
                    Located in {destination.country}, {destination.name} offers visitors a unique blend of 
                    {destination.tags.join(', ')} experiences. With its stunning landscapes and rich cultural heritage,
                    it's no wonder that {destination.name} is a favorite among travelers seeking authentic experiences.
                  </p>
                  
                  <h3 className="text-xl font-heading font-semibold mb-3">Highlights</h3>
                  <ul className="list-disc pl-5 text-neutral-600 mb-6 space-y-1">
                    <li>Explore the breathtaking natural scenery</li>
                    <li>Immerse yourself in the local culture</li>
                    <li>Try delicious regional cuisine</li>
                    <li>Discover hidden gems off the tourist track</li>
                  </ul>
                  
                  <h3 className="text-xl font-heading font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="things-to-do" className="mt-0">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-heading font-semibold mb-4">Things to Do in {destination.name}</h2>
                  <p className="text-neutral-600 mb-6">
                    Discover the best activities and attractions in {destination.name}.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="text-lg font-medium mb-2">Top Attractions</h3>
                      <p className="text-neutral-600">
                        The most popular places to visit and experience in {destination.name}.
                      </p>
                    </div>
                    
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="text-lg font-medium mb-2">Local Experiences</h3>
                      <p className="text-neutral-600">
                        Authentic activities to engage with the local culture and traditions.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Day Trips</h3>
                      <p className="text-neutral-600">
                        Explore nearby destinations and attractions in the surrounding area.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="travel-tips" className="mt-0">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-heading font-semibold mb-4">Travel Tips for {destination.name}</h2>
                  <p className="text-neutral-600 mb-6">
                    Essential information and advice for planning your trip to {destination.name}.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="text-lg font-medium mb-2">Getting Around</h3>
                      <p className="text-neutral-600">
                        Information about local transportation options and how to navigate {destination.name}.
                      </p>
                    </div>
                    
                    <div className="border-b border-neutral-200 pb-4">
                      <h3 className="text-lg font-medium mb-2">Where to Stay</h3>
                      <p className="text-neutral-600">
                        Recommendations for accommodations in different areas and budget ranges.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Local Customs</h3>
                      <p className="text-neutral-600">
                        Important cultural norms and etiquette to be aware of during your visit.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-0">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-heading font-semibold mb-4">{destination.name} Gallery</h2>
                  <p className="text-neutral-600 mb-6">
                    Visual inspiration for your trip to {destination.name}.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* In a real app, these would be multiple images of the destination */}
                    <img 
                      src={destination.imageUrl} 
                      alt={`${destination.name} scenery`} 
                      className="rounded-lg object-cover w-full h-40" 
                    />
                    <img 
                      src={destination.imageUrl} 
                      alt={`${destination.name} attractions`} 
                      className="rounded-lg object-cover w-full h-40" 
                    />
                    <img 
                      src={destination.imageUrl} 
                      alt={`${destination.name} culture`} 
                      className="rounded-lg object-cover w-full h-40" 
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Related blog posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading font-semibold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Similar destinations */}
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-6">You Might Also Like</h2>
              <div className="flex overflow-x-auto pb-4 space-x-4">
                {/* In a real app, these would be fetched from API */}
                <div className="min-w-[300px] bg-white rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={destination.imageUrl} 
                    alt="Similar destination" 
                    className="h-40 w-full object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Similar Destination</h3>
                    <p className="text-sm text-neutral-600 mb-2">Another great place to visit</p>
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </div>
                </div>
                <div className="min-w-[300px] bg-white rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={destination.imageUrl} 
                    alt="Similar destination" 
                    className="h-40 w-full object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Similar Destination</h3>
                    <p className="text-sm text-neutral-600 mb-2">Another great place to visit</p>
                    <Button variant="outline" size="sm" className="w-full">View</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
