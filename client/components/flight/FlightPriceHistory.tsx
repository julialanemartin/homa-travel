import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Types
interface FlightPriceHistoryData {
  priceHistory: {
    date: string;
    price: number;
    minPrice: number;
    maxPrice: number;
  }[];
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  currency: string;
  status: string;
}

interface FlightPriceHistoryProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  className?: string;
}

export default function FlightPriceHistory({
  origin,
  destination,
  departureDate,
  returnDate,
  className = "",
}: FlightPriceHistoryProps) {
  const [activeChart, setActiveChart] = useState("trend");

  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Query for price history data using Amadeus API
  const { data, isLoading, isError, error } = useQuery<FlightPriceHistoryData>({
    queryKey: ["/api/amadeus/price-history", origin, destination, departureDate, returnDate],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        origin,
        destination,
        departureDate,
        ...(returnDate && { returnDate }),
      });
      
      const response = await apiRequest(
        "GET", 
        `/api/amadeus/price-history?${queryParams.toString()}`
      );
      
      return await response.json();
    },
    enabled: !!origin && !!destination && !!departureDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Format data for charts
  const chartData = data?.priceHistory?.map(item => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price: item.price,
    minPrice: item.minPrice,
    maxPrice: item.maxPrice,
  })) || [];
  
  // Calculate price trends
  const priceTrend = (() => {
    if (!data?.priceHistory || data.priceHistory.length < 2) return null;
    
    const firstPrice = data.priceHistory[0].price;
    const lastPrice = data.priceHistory[data.priceHistory.length - 1].price;
    const priceDiff = lastPrice - firstPrice;
    const percentChange = ((priceDiff / firstPrice) * 100).toFixed(1);
    
    return {
      direction: priceDiff < 0 ? "down" : "up",
      percentChange: Math.abs(Number(percentChange)),
      priceDiff: Math.abs(priceDiff),
    };
  })();
  
  // Determine best day to buy based on pricing data
  const bestDayToBuy = (() => {
    if (!data?.priceHistory || data.priceHistory.length === 0) return null;
    
    let lowestPriceDay = data.priceHistory[0];
    
    data.priceHistory.forEach(day => {
      if (day.price < lowestPriceDay.price) {
        lowestPriceDay = day;
      }
    });
    
    return {
      date: lowestPriceDay.date,
      price: lowestPriceDay.price,
    };
  })();
  
  // Calculate price prediction for next 7 days
  const pricePrediction = (() => {
    if (!data?.priceHistory || data.priceHistory.length < 3) return "stable";
    
    const lastFewPrices = data.priceHistory.slice(-3);
    const trend = lastFewPrices.reduce((acc, curr, i, arr) => {
      if (i === 0) return acc;
      return acc + (curr.price - arr[i - 1].price);
    }, 0);
    
    if (trend < -20) return "decreasing";
    if (trend > 20) return "increasing";
    return "stable";
  })();
  
  // Handle loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Handle error state
  if (isError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Flight Price History</CardTitle>
          <CardDescription>
            {origin} → {destination} • {formatDate(departureDate)}
            {returnDate ? ` to ${formatDate(returnDate)}` : " (One-way)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Unable to load flight price history: {(error as Error)?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Render loaded data
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Flight Price History
              {priceTrend && (
                <Badge className={priceTrend.direction === "down" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {priceTrend.direction === "down" ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {priceTrend.percentChange}%
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {origin} → {destination} • {formatDate(departureDate)}
              {returnDate ? ` to ${formatDate(returnDate)}` : " (One-way)"}
            </CardDescription>
          </div>
          
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className="font-mono">
              Min: ${data?.minPrice}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Avg: ${Math.round(data?.avgPrice || 0)}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Max: ${data?.maxPrice}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {data?.priceHistory && data.priceHistory.length > 0 ? (
          <>
            <Tabs value={activeChart} onValueChange={setActiveChart} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trend">Price Trend</TabsTrigger>
                <TabsTrigger value="range">Price Range</TabsTrigger>
                <TabsTrigger value="comparison">Daily Comparison</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trend" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Price']} 
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <ReferenceLine 
                        y={data.avgPrice} 
                        stroke="#8884d8" 
                        strokeDasharray="3 3" 
                        label={{ value: 'Avg', position: 'right' }} 
                      />
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
              </TabsContent>
              
              <TabsContent value="range" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Price']} 
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="minPrice" 
                        stackId="1"
                        stroke="#4bc0c0" 
                        fill="#4bc0c05a" 
                        name="Min Price"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stackId="2"
                        stroke="#2d8a9a" 
                        fill="#2d8a9a5a"
                        name="Average Price" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="maxPrice"
                        stackId="3" 
                        stroke="#ff9f92" 
                        fill="#ff9f925a"
                        name="Max Price" 
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="comparison" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Price']} 
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <ReferenceLine y={data.avgPrice} stroke="#8884d8" />
                      <Bar 
                        dataKey="price" 
                        fill="#2d8a9a" 
                        name="Price"
                        radius={[4, 4, 0, 0]} 
                      />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Lowest Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${data.minPrice}</div>
                  {bestDayToBuy && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Best day to buy: {formatDate(bestDayToBuy.date)}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Price Change</CardTitle>
                </CardHeader>
                <CardContent>
                  {priceTrend ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {priceTrend.direction === "down" ? "-" : "+"}
                        ${priceTrend.priceDiff}
                      </span>
                      <Badge className={priceTrend.direction === "down" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {priceTrend.direction === "down" ? (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        {priceTrend.percentChange}%
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">No change</div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">Over the tracked period</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Price Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pricePrediction === "decreasing" && (
                      <span className="text-green-600 flex items-center">
                        <TrendingDown className="h-5 w-5 mr-1" />
                        Decreasing
                      </span>
                    )}
                    {pricePrediction === "increasing" && (
                      <span className="text-red-600 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-1" />
                        Increasing
                      </span>
                    )}
                    {pricePrediction === "stable" && (
                      <span>Stable</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Predicted trend for next week</div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Price Data Available</AlertTitle>
            <AlertDescription>
              We couldn't find historical price data for this route. This may be due to limited data availability for this specific route.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}