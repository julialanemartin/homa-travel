import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import { 
  MapPin, 
  DollarSign, 
  Heart, 
  Plane, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Star
} from 'lucide-react';
import { Link } from 'wouter';

interface TravelPlan {
  id: number;
  name: string;
  destinationId: number;
  destinationName: string;
  startDate: string;
  endDate: string;
  currency: string;
  totalBudget: number;
  perPersonBudget: number;
  isPublic: boolean;
  createdAt: string;
}

interface MoodBoard {
  id: number;
  name: string;
  description: string;
  coverImageUrl: string;
  isPublic: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user's travel plans
  const { data: travelPlans, isLoading: plansLoading } = useQuery<TravelPlan[]>({
    queryKey: ['/api/travel-plans/user', user?.id],
    enabled: !!user?.id,
  });

  // Fetch user's mood boards
  const { data: moodBoards, isLoading: boardsLoading } = useQuery<MoodBoard[]>({
    queryKey: ['/api/mood-boards/user', user?.id],
    enabled: !!user?.id,
  });

  // Fetch user's flight alerts
  const { data: flightAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/flight-alerts/user', user?.id],
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
        <Link href="/auth">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Travel Dashboard - Homa Travel Co.</title>
        <meta name="description" content="Manage your travel plans, budgets, and mood boards in one place." />
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.username}! 👋
            </h1>
            <p className="text-gray-600">
              Manage your travel plans, track flight prices, and organize your dream destinations.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <TrendingUp className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="travel-plans">
                <MapPin className="h-4 w-4 mr-2" />
                Travel Plans
              </TabsTrigger>
              <TabsTrigger value="mood-boards">
                <Heart className="h-4 w-4 mr-2" />
                Mood Boards
              </TabsTrigger>
              <TabsTrigger value="flight-alerts">
                <Plane className="h-4 w-4 mr-2" />
                Flight Alerts
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-homa-blue" />
                      Travel Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-homa-blue">
                      {travelPlans?.length || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Active travel plans</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-homa-blue" />
                      Mood Boards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-homa-blue">
                      {moodBoards?.length || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Inspiration collections</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Plane className="h-5 w-5 mr-2 text-homa-blue" />
                      Price Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-homa-blue">
                      {flightAlerts?.length || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Active flight alerts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Start planning your next adventure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/budget-calculator">
                      <Button variant="outline" className="w-full h-20 flex flex-col">
                        <DollarSign className="h-6 w-6 mb-2" />
                        Plan Budget
                      </Button>
                    </Link>
                    <Link href="/destination-matcher">
                      <Button variant="outline" className="w-full h-20 flex flex-col">
                        <MapPin className="h-6 w-6 mb-2" />
                        Find Destination
                      </Button>
                    </Link>
                    <Link href="/mood-board">
                      <Button variant="outline" className="w-full h-20 flex flex-col">
                        <Heart className="h-6 w-6 mb-2" />
                        Create Mood Board
                      </Button>
                    </Link>
                    <Link href="/flight-tracker">
                      <Button variant="outline" className="w-full h-20 flex flex-col">
                        <Plane className="h-6 w-6 mb-2" />
                        Track Flights
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Travel Plans Tab */}
            <TabsContent value="travel-plans">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Your Travel Plans</h2>
                  <p className="text-gray-600">Manage and track your upcoming adventures</p>
                </div>
                <Link href="/budget-calculator">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Travel Plan
                  </Button>
                </Link>
              </div>

              {plansLoading ? (
                <div className="text-center py-8">Loading your travel plans...</div>
              ) : travelPlans?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {travelPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription>
                              {plan.destinationName}
                            </CardDescription>
                          </div>
                          <Badge variant={plan.isPublic ? "default" : "secondary"}>
                            {plan.isPublic ? "Public" : "Private"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            ${plan.perPersonBudget} per person • ${plan.totalBudget} total
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No travel plans yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start planning your next adventure with our budget calculator
                    </p>
                    <Link href="/budget-calculator">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Plan
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Mood Boards Tab */}
            <TabsContent value="mood-boards">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Your Mood Boards</h2>
                  <p className="text-gray-600">Visual inspiration for your travels</p>
                </div>
                <Link href="/mood-board">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Mood Board
                  </Button>
                </Link>
              </div>

              {boardsLoading ? (
                <div className="text-center py-8">Loading your mood boards...</div>
              ) : moodBoards?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {moodBoards.map((board) => (
                    <Card key={board.id} className="hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                        {board.coverImageUrl ? (
                          <img 
                            src={board.coverImageUrl} 
                            alt={board.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{board.name}</CardTitle>
                        <CardDescription>
                          {board.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No mood boards yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create visual inspiration boards for your dream destinations
                    </p>
                    <Link href="/mood-board">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Mood Board
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Flight Alerts Tab */}
            <TabsContent value="flight-alerts">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Flight Price Alerts</h2>
                  <p className="text-gray-600">Track flight prices and get notified of deals</p>
                </div>
                <Link href="/flight-tracker">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Price Alert
                  </Button>
                </Link>
              </div>

              {alertsLoading ? (
                <div className="text-center py-8">Loading your flight alerts...</div>
              ) : flightAlerts?.length ? (
                <div className="space-y-4">
                  {flightAlerts.map((alert: any) => (
                    <Card key={alert.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {alert.origin} → {alert.destination}
                            </h3>
                            <p className="text-gray-600">
                              Departure: {new Date(alert.departureDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Alert when price drops below ${alert.priceThreshold}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-homa-blue">
                              ${alert.lastPrice || 'N/A'}
                            </div>
                            <Badge variant={alert.lastPrice && alert.lastPrice <= alert.priceThreshold ? "default" : "secondary"}>
                              {alert.lastPrice && alert.lastPrice <= alert.priceThreshold ? "Deal Available!" : "Monitoring"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Plane className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No flight alerts yet</h3>
                    <p className="text-gray-600 mb-4">
                      Set up price alerts to track flight deals for your destinations
                    </p>
                    <Link href="/flight-tracker">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Alert
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}