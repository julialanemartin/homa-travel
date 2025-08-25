import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Destination } from '@/lib/types';
import { DestinationCard, FilterTags } from '@/components/destinations';
import { GrayInput } from '@/components/ui/gray-input';
import { Button } from '@/components/ui/button';
import { GraySelect, GraySelectContent, GraySelectItem, GraySelectTrigger, GraySelectValue } from '@/components/ui/gray-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet';
import { Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Destinations() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [continent, setContinent] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const searchParam = params.get('search');
    const continentParam = params.get('continent');
    
    if (searchParam) setSearchQuery(searchParam);
    if (continentParam) setContinent(continentParam);
  }, [location]);

  // Fetch all destinations
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({
    queryKey: ['/api/destinations', continent, selectedTags],
    queryFn: async () => {
      const url = new URL('/api/destinations', window.location.origin);
      if (continent && continent !== 'all') url.searchParams.append('continent', continent);
      if (selectedTags.length > 0) url.searchParams.append('tags', selectedTags.join(','));
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  // Filter destinations based on search query
  const filteredDestinations = destinations?.filter(destination => {
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        destination.name.toLowerCase().includes(query) ||
        destination.country.toLowerCase().includes(query) ||
        destination.description.toLowerCase().includes(query) ||
        destination.tags.some(tag => tag.toLowerCase().includes(query))
      );
      if (!matchesSearch) return false;
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      const matchesTags = selectedTags.some(selectedTag => 
        destination.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
      if (!matchesTags) return false;
    }
    
    return true;
  });

  // Extract all unique tags from destinations
  const allTags = React.useMemo(() => {
    if (!destinations) return [];
    
    const tagsSet = new Set<string>();
    destinations.forEach(destination => {
      destination.tags.forEach(tag => tagsSet.add(tag));
    });
    
    return Array.from(tagsSet).sort();
  }, [destinations]);

  // Continents for filter
  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <Helmet>
        <title>Explore Destinations | Homa Travel Co.</title>
        <meta name="description" content="Discover amazing travel destinations around the world. Find your next adventure with Homa Travel Co." />
      </Helmet>
      
      <div className="bg-[#f0f5f7] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Explore Destinations</h1>
            <p className="text-neutral-600">Discover the perfect location for your next adventure, from tropical paradises to cultural capitals.</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow relative">
                <GrayInput
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
              
              <div className="w-full md:w-48">
                <GraySelect value={continent} onValueChange={setContinent}>
                  <GraySelectTrigger>
                    <GraySelectValue placeholder="All Continents" />
                  </GraySelectTrigger>
                  <GraySelectContent>
                    <GraySelectItem value="all">All Continents</GraySelectItem>
                    {continents.map(c => (
                      <GraySelectItem key={c} value={c}>{c}</GraySelectItem>
                    ))}
                  </GraySelectContent>
                </GraySelect>
              </div>
            </div>
            
            {/* Tags */}
            <FilterTags 
              selectedTags={selectedTags}
              onTagSelect={toggleTag}
            />
          </div>
          
          {/* Destinations Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-md h-96">
                  <div className="h-52 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
              Failed to load destinations. Please try again later.
            </div>
          ) : filteredDestinations?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-neutral-600 mb-4">Try adjusting your search criteria or filters.</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setContinent('all');
                  setSelectedTags([]);
                }}
                style={{
                  backgroundColor: '#2d8a9a',
                  color: 'white'
                }}
                className="hover:bg-[#2d8a9a]/90"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations?.map(destination => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}