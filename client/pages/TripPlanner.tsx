import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Thermometer, Backpack, Car, Shield, Users, Clock } from "lucide-react";

interface WeatherInfo {
  season: string;
  temperature: string;
  rainfall: string;
  bestMonths: string[];
  activities: string[];
}

interface PackingItem {
  category: string;
  items: string[];
  essential: boolean;
}

interface TransportationOption {
  type: string;
  description: string;
  cost: string;
  duration: string;
}

interface TripPlanningData {
  destination: string;
  weather: WeatherInfo[];
  packingList: PackingItem[];
  transportation: TransportationOption[];
  culturalTips: string[];
  emergencyInfo: {
    emergencyNumber: string;
    embassy: string;
    hospitals: string[];
    commonPhrases: Record<string, string>;
  };
  timeZone: string;
  currency: string;
  tipping: string;
}

export default function TripPlanner() {
  const [destination, setDestination] = useState<string>("");
  const [activeTab, setActiveTab] = useState("weather");

  const { data: planningData, isLoading, refetch } = useQuery<TripPlanningData>({
    queryKey: [`/api/trip-planning/${encodeURIComponent(destination)}`],
    enabled: false, // Don't auto-fetch, only on button click
  });

  const handlePlanTrip = () => {
    if (destination.trim()) {
      refetch();
    }
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Essential Trip Planner</h1>
          <p className="text-lg text-gray-700">
            Weather, packing, transport, culture, and safety information for your destination
          </p>
        </div>

        {/* Trip Planning Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Plan Your Trip
            </CardTitle>
            <CardDescription>
              Enter your destination to get personalized planning information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, France"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handlePlanTrip} className="mt-4 w-full md:w-auto">
              Generate Trip Plan
            </Button>
          </CardContent>
        </Card>

        {/* Planning Information Tabs */}
        {planningData && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="weather" className="flex items-center gap-1">
                <Thermometer className="h-4 w-4" />
                Weather
              </TabsTrigger>
              <TabsTrigger value="packing" className="flex items-center gap-1">
                <Backpack className="h-4 w-4" />
                Packing
              </TabsTrigger>
              <TabsTrigger value="transport" className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                Transport
              </TabsTrigger>
              <TabsTrigger value="culture" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Culture
              </TabsTrigger>
              <TabsTrigger value="safety" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Safety
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weather" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weather & Best Time to Visit</CardTitle>
                  <CardDescription>Seasonal information for {planningData.destination}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {planningData.weather.map((season, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{season.season}</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Temperature:</strong> {season.temperature}</p>
                          <p><strong>Rainfall:</strong> {season.rainfall}</p>
                          <div>
                            <strong>Best for:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {season.activities.map((activity, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packing" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Packing List</CardTitle>
                  <CardDescription>Customized for your destination and travel dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {planningData.packingList.map((category, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          {category.category}
                          {category.essential && (
                            <Badge variant="destructive" className="text-xs">Essential</Badge>
                          )}
                        </h3>
                        <ul className="space-y-1">
                          {category.items.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-center gap-2">
                              <input type="checkbox" className="rounded" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transport" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Local Transportation</CardTitle>
                  <CardDescription>Getting around {planningData.destination}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {planningData.transportation.map((option, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{option.type}</h3>
                          <div className="text-right text-sm">
                            <div className="font-medium">{option.cost}</div>
                            <div className="text-muted-foreground">{option.duration}</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="culture" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cultural Guide</CardTitle>
                  <CardDescription>Local customs and etiquette</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Cultural Tips</h3>
                      <ul className="space-y-2">
                        {planningData.culturalTips.map((tip, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-[#2d8a9a] mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Essential Phrases</h3>
                      <div className="space-y-2">
                        {Object.entries(planningData.emergencyInfo.commonPhrases).map(([english, local], index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium">{english}</div>
                            <div className="text-muted-foreground italic">{local}</div>
                            <Separator className="my-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="border rounded-lg p-3">
                      <strong>Time Zone:</strong> {planningData.timeZone}
                    </div>
                    <div className="border rounded-lg p-3">
                      <strong>Currency:</strong> {planningData.currency}
                    </div>
                    <div className="border rounded-lg p-3">
                      <strong>Tipping:</strong> {planningData.tipping}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Safety & Emergency Information</CardTitle>
                  <CardDescription>Important contacts and safety tips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-red-50">
                        <h3 className="font-semibold text-red-800 mb-2">Emergency Number</h3>
                        <p className="text-2xl font-bold text-red-700">
                          {planningData.emergencyInfo.emergencyNumber}
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Embassy Contact</h3>
                        <p className="text-sm">{planningData.emergencyInfo.embassy}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Major Hospitals</h3>
                      <ul className="space-y-2">
                        {planningData.emergencyInfo.hospitals.map((hospital, index) => (
                          <li key={index} className="text-sm border rounded p-2">
                            {hospital}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


          </Tabs>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#2d8a9a] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Gathering comprehensive trip planning information...</p>
          </div>
        )}
      </div>
    </div>
  );
}