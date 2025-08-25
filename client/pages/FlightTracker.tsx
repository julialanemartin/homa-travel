import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

// Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Check, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

// Import FlightPriceHistory component
import FlightPriceHistory from "@/components/flight/FlightPriceHistory";

// Mock user ID - in a real app this would come from authentication
const MOCK_USER_ID = 1;

// Form schema for creating a flight alert
const flightAlertSchema = z.object({
  origin: z.string().min(3, "Origin airport code must be 3 characters").max(3, "Origin airport code must be 3 characters"),
  destination: z.string().min(3, "Destination airport code must be 3 characters").max(3, "Destination airport code must be 3 characters"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  priceThreshold: z.coerce.number().min(1, "Price threshold must be at least 1"),
  email: z.string().email("Please enter a valid email address"),
  userId: z.number().default(MOCK_USER_ID)
});

type FlightAlertFormValues = z.infer<typeof flightAlertSchema>;

// Helper function to format dates for display
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

// Component to display a single flight alert
const FlightAlertCard = ({ alert, onDelete, onRefresh }) => {
  const { toast } = useToast();
  
  // Format the price check date
  const lastCheckedDate = alert.lastChecked 
    ? new Date(alert.lastChecked).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Never";
  
  // Calculate if price is below threshold
  const isPriceBelowThreshold = alert.lastPrice !== null && alert.lastPrice <= alert.priceThreshold;
  
  // Query for price history
  const { data: priceHistory } = useQuery({
    queryKey: ["/api/flight-price-history", alert.id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/flight-price-history/${alert.id}`);
      return await response.json();
    },
    enabled: !!alert.id,
  });

  // Format price history data for chart
  const chartData = priceHistory?.map(entry => ({
    date: new Date(entry.timestamp).toLocaleDateString(),
    price: entry.price
  })) || [];
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {alert.origin} → {alert.destination}
            </CardTitle>
            <CardDescription>
              {formatDate(alert.departureDate)} 
              {alert.returnDate ? ` to ${formatDate(alert.returnDate)}` : " (One-way)"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onRefresh(alert.id)}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Check
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(alert.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 flex gap-2">
          <Badge>Target: ${alert.priceThreshold}</Badge>
          {alert.lastPrice !== null && (
            <Badge variant={isPriceBelowThreshold ? "success" : "secondary"}>
              Current: ${alert.lastPrice}
            </Badge>
          )}
          {alert.active ? (
            <Badge variant="outline" className="bg-green-50">Active</Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100">Inactive</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {alert.lastPrice !== null && (
          <>
            {isPriceBelowThreshold ? (
              <Alert className="bg-green-50 mb-4">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Price Alert!</AlertTitle>
                <AlertDescription>
                  Current price (${alert.lastPrice}) is below your threshold (${alert.priceThreshold})
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-orange-50 mb-4">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-600">Price Above Threshold</AlertTitle>
                <AlertDescription>
                  Current price (${alert.lastPrice}) is above your threshold (${alert.priceThreshold})
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
        
        {chartData.length > 0 && (
          <div className="h-40 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2d8a9a" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="text-sm text-gray-500 mt-4">
          {alert.email && <div>Notification email: {alert.email}</div>}
          <div>Last checked: {lastCheckedDate}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Flight Tracker page component
export default function FlightTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("myAlerts");
  
  // Form setup
  const form = useForm<FlightAlertFormValues>({
    resolver: zodResolver(flightAlertSchema),
    defaultValues: {
      origin: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      priceThreshold: 300,
      email: "",
      userId: MOCK_USER_ID
    }
  });
  
  // Query for user's flight alerts
  const { data: flightAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/flight-alerts/user", MOCK_USER_ID],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/flight-alerts/user/${MOCK_USER_ID}`);
      return await response.json();
    }
  });
  
  // Mutation for creating a new flight alert
  const createAlertMutation = useMutation({
    mutationFn: async (data: FlightAlertFormValues) => {
      const response = await apiRequest("POST", "/api/flight-alerts", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flight-alerts/user", MOCK_USER_ID] });
      toast({
        title: "Flight alert created",
        description: "Your flight price alert has been created successfully.",
      });
      form.reset();
      setActiveTab("myAlerts");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create flight alert: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for deleting a flight alert
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("DELETE", `/api/flight-alerts/${alertId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flight-alerts/user", MOCK_USER_ID] });
      toast({
        title: "Flight alert deleted",
        description: "Your flight price alert has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete flight alert: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for checking current flight price with Skyscanner data
  const checkPriceMutation = useMutation({
    mutationFn: async (alertId: number) => {
      // Use real Skyscanner API data
      const response = await apiRequest("POST", `/api/skyscanner/check-price/${alertId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flight-alerts/user", MOCK_USER_ID] });
      toast({
        title: "Price checked",
        description: "The flight price has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to check flight price: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: FlightAlertFormValues) => {
    createAlertMutation.mutate(data);
  };
  
  // Form for direct price history search
  const priceHistoryForm = useForm({
    defaultValues: {
      origin: "",
      destination: "",
      departureDate: "",
      returnDate: ""
    },
    resolver: zodResolver(
      z.object({
        origin: z.string().min(3, "Origin code must be 3 characters").max(3),
        destination: z.string().min(3, "Destination code must be 3 characters").max(3),
        departureDate: z.string().min(1, "Departure date is required"),
        returnDate: z.string().optional()
      })
    )
  });

  // State for tracking search parameters
  const [searchParams, setSearchParams] = useState<null | {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
  }>(null);

  // Handle direct price history search
  const onSearchPriceHistory = (data: any) => {
    setSearchParams(data);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">Flight Price Tracker</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="myAlerts">My Price Alerts</TabsTrigger>
            <TabsTrigger value="createAlert">Create New Alert</TabsTrigger>
            <TabsTrigger value="searchPrices">
              <Search className="h-4 w-4 mr-1" />
              Search Prices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="myAlerts">
            <Card>
              <CardHeader>
                <CardTitle>Your Flight Price Alerts</CardTitle>
                <CardDescription>
                  Track flight prices and get notified when they drop below your target price.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alertsLoading ? (
                  <div className="text-center py-4">Loading your alerts...</div>
                ) : flightAlerts?.length > 0 ? (
                  flightAlerts.map(alert => (
                    <FlightAlertCard 
                      key={alert.id} 
                      alert={alert} 
                      onDelete={(id) => deleteAlertMutation.mutate(id)}
                      onRefresh={(id) => checkPriceMutation.mutate(id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">You don't have any flight price alerts yet.</div>
                    <Button onClick={() => setActiveTab("createAlert")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Create Your First Alert
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="createAlert">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Flight Price Alert</CardTitle>
                <CardDescription>
                  Set up an alert to track flight prices for your travel plans.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Origin (Airport Code)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="JFK" 
                                {...field} 
                                maxLength={3}
                                style={{ textTransform: 'uppercase' }}
                                onChange={(e) => {
                                  const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>Enter 3-letter airport code (e.g. JFK, LAX, LHR)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination (Airport Code)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="LAX" 
                                {...field} 
                                maxLength={3}
                                style={{ textTransform: 'uppercase' }}
                                onChange={(e) => {
                                  const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>Enter 3-letter airport code (e.g. JFK, LAX, LHR)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="priceThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>You'll be notified when price drops below this amount</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email for Notifications</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormDescription>We'll email you when prices drop</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={createAlertMutation.isPending}
                      style={{ backgroundColor: "#2d8a9a" }}
                    >
                      {createAlertMutation.isPending ? "Creating..." : "Create Flight Price Alert"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-6">
                <Link href="#" onClick={() => setActiveTab("myAlerts")} className="text-sm text-blue-600 hover:underline">
                  ← Back to My Price Alerts
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="searchPrices">
            <Card>
              <CardHeader>
                <CardTitle>Flight Price History Analytics</CardTitle>
                <CardDescription>
                  Search for detailed price history and trends for specific flight routes using real-time data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...priceHistoryForm}>
                  <form onSubmit={priceHistoryForm.handleSubmit(onSearchPriceHistory)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={priceHistoryForm.control}
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
                        control={priceHistoryForm.control}
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
                        control={priceHistoryForm.control}
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
                        control={priceHistoryForm.control}
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
                      Search Flight Prices
                    </Button>
                  </form>
                </Form>
                
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
        </Tabs>
      </div>
    </div>
  );
}