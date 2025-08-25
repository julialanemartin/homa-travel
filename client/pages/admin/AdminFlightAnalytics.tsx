import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from '@/components/admin/AdminLayout';
import FlightPriceHistory from '@/components/flight/FlightPriceHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, Plane, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell 
} from 'recharts';

// Schema for the search form
const searchFormSchema = z.object({
  origin: z.string().min(3, "Origin code must be 3 characters").max(3),
  destination: z.string().min(3, "Destination code must be 3 characters").max(3),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional()
});

// Colors for charts
const COLORS = ['#2d8a9a', '#4bc0c0', '#ff9f92', '#ffcd56', '#a5b4fc'];

export default function AdminFlightAnalytics() {
  const [activeTab, setActiveTab] = useState('priceAnalytics');
  
  // State for tracking search parameters
  const [searchParams, setSearchParams] = useState<null | {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
  }>(null);
  
  // Form for direct price history search
  const searchForm = useForm({
    defaultValues: {
      origin: "",
      destination: "",
      departureDate: "",
      returnDate: ""
    },
    resolver: zodResolver(searchFormSchema)
  });
  
  // Query for fetching flight alerts count
  const { data: flightAlertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/flight-alerts/stats"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/flight-alerts/stats");
      return await response.json();
    }
  });
  
  // Query for popular routes data
  const { data: popularRoutesData, isLoading: routesLoading } = useQuery({
    queryKey: ["/api/flight-alerts/popular-routes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/flight-alerts/popular-routes");
      return await response.json();
    }
  });
  
  // Mocked analytics data for demonstration if API is unavailable
  const getDemoChartData = () => {
    const mockAlertStats = {
      total: 14,
      active: 12,
      triggered: 3,
      byMonth: [
        { month: 'Jan', alerts: 2 },
        { month: 'Feb', alerts: 3 },
        { month: 'Mar', alerts: 4 },
        { month: 'Apr', alerts: 5 }
      ]
    };
    
    const mockPopularRoutes = [
      { route: 'JFK-LAX', count: 8, percentage: 25 },
      { route: 'SFO-NYC', count: 6, percentage: 18.75 },
      { route: 'ORD-MIA', count: 5, percentage: 15.63 },
      { route: 'DFW-LAS', count: 4, percentage: 12.5 },
      { route: 'SEA-BOS', count: 3, percentage: 9.38 }
    ];
    
    return {
      alertStats: flightAlertsData || mockAlertStats,
      popularRoutes: popularRoutesData || mockPopularRoutes
    };
  };
  
  // Get analytics data
  const analyticsData = getDemoChartData();
  
  // Handle search form submission
  const onSearchSubmit = (data: any) => {
    setSearchParams(data);
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Flight Analytics | Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Flight Analytics Dashboard</h1>
            <p className="text-neutral-500">Detailed insights into flight prices and alerts</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary flex items-center">
            <Plane className="h-4 w-4 mr-1" />
            Skyscanner API Integrated
          </Badge>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="priceAnalytics">
              <TrendingUp className="h-4 w-4 mr-1" />
              Price Analytics
            </TabsTrigger>
            <TabsTrigger value="alertsOverview">
              <AlertCircle className="h-4 w-4 mr-1" />
              Alerts Overview
            </TabsTrigger>
            <TabsTrigger value="trendingRoutes">
              <Plane className="h-4 w-4 mr-1" />
              Trending Routes
            </TabsTrigger>
          </TabsList>
          
          {/* Price Analytics Tab */}
          <TabsContent value="priceAnalytics">
            <Card>
              <CardHeader>
                <CardTitle>Flight Price History Search</CardTitle>
                <CardDescription>
                  Search historical price data for specific routes using the Skyscanner API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...searchForm}>
                  <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={searchForm.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Origin (Airport Code)</FormLabel>
                            <FormControl>
                              <Input placeholder="JFK" {...field} />
                            </FormControl>
                            <FormDescription>Enter 3-letter airport code</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={searchForm.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination (Airport Code)</FormLabel>
                            <FormControl>
                              <Input placeholder="LAX" {...field} />
                            </FormControl>
                            <FormDescription>Enter 3-letter airport code</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={searchForm.control}
                        name="departureDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departure Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={searchForm.control}
                        name="returnDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Return Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>Leave empty for one-way flights</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      style={{ backgroundColor: "#2d8a9a" }}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Analyze Flight Prices
                    </Button>
                  </form>
                </Form>
                
                {!searchParams && !process.env.SKYSCANNER_API_KEY && (
                  <Alert className="mt-6 bg-amber-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>API Key Required</AlertTitle>
                    <AlertDescription>
                      To use real flight price data, you need to add a Skyscanner API key to your environment variables.
                    </AlertDescription>
                  </Alert>
                )}
                
                {searchParams && (
                  <div className="mt-8">
                    <FlightPriceHistory 
                      origin={searchParams.origin}
                      destination={searchParams.destination}
                      departureDate={searchParams.departureDate}
                      returnDate={searchParams.returnDate}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Alerts Overview Tab */}
          <TabsContent value="alertsOverview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-primary mr-4" />
                    <span className="text-3xl font-bold">{analyticsData.alertStats.total}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
                    <span className="text-3xl font-bold">{analyticsData.alertStats.active}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Price Drops Triggered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingDown className="h-8 w-8 text-amber-500 mr-4" />
                    <span className="text-3xl font-bold">{analyticsData.alertStats.triggered}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Alerts Created Over Time</CardTitle>
                <CardDescription>
                  Monthly distribution of flight price alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.alertStats.byMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="alerts" 
                        fill="#2d8a9a" 
                        name="Alerts"
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Trending Routes Tab */}
          <TabsContent value="trendingRoutes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Routes</CardTitle>
                  <CardDescription>
                    Most frequently tracked flight routes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={analyticsData.popularRoutes}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="route" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#2d8a9a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Route Distribution</CardTitle>
                  <CardDescription>
                    Percentage breakdown of tracked routes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.popularRoutes}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="percentage"
                          nameKey="route"
                          label={({route, percentage}) => `${route} (${percentage}%)`}
                        >
                          {analyticsData.popularRoutes.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}