import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Info, 
  Calculator, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Plane, 
  RefreshCw, 
  Home, 
  Utensils, 
  Car, 
  Ticket, 
  ShoppingBag,
  ArrowRight,
  BookmarkPlus,
  Save,
  User
} from "lucide-react";
import { Destination, DestinationCostData } from "@shared/schema";

// Type definitions for budget calculations
interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  miscellaneous: number;
  flights: number;
}

interface BudgetCalculation {
  totalBudget: number;
  perPersonBudget: number;
  perDayBudget: number;
  breakdown: BudgetBreakdown;
  currency: string;
  numDays: number;
  isEstimated?: boolean; // Flag to indicate if this budget uses estimated costs
}

export default function BudgetCalculator() {
  // State for calculator inputs
  const [destinationId, setDestinationId] = useState<number | null>(null);
  const [accommodationType, setAccommodationType] = useState("midrange");
  const [mealPreference, setMealPreference] = useState("mixed");
  const [transportationType, setTransportationType] = useState("public");
  const [numTravelers, setNumTravelers] = useState(2);
  const [includeFlights, setIncludeFlights] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [originAirport, setOriginAirport] = useState("LAX"); // Default origin
  const [destinationAirport, setDestinationAirport] = useState(""); // Will be populated based on selected destination
  const [flightCostEstimate, setFlightCostEstimate] = useState<{
    price: number;
    currency: string;
    isEstimate: boolean;
  } | null>(null);
  const [isFetchingFlightCost, setIsFetchingFlightCost] = useState(false);
  const [addedActivities, setAddedActivities] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [emergencyFundPercentage, setEmergencyFundPercentage] = useState(10);
  
  // Calculated budget state
  const [budgetCalculation, setBudgetCalculation] = useState<BudgetCalculation | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<string>("local");
  
  // Save travel plan state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planIsPublic, setPlanIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch destinations for dropdown
  const { data: destinations } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });
  
  // Fetch cost data for selected destination
  const { data: costData, isLoading: isCostDataLoading } = useQuery<DestinationCostData[]>({
    queryKey: ["/api/destination-costs"],
  });
  
  // Destination airport codes (in a real app, this would come from the database)
  const destinationAirports: {[key: number]: string} = {
    1: "JTR", // Santorini
    2: "NRT", // Kyoto (using Tokyo)
    3: "ZRH", // Swiss Alps
    4: "DPS", // Bali
    5: "BCN", // Barcelona
    6: "RAK", // Marrakech
    7: "CUZ", // Machu Picchu (Cusco)
    8: "JFK", // New York City
    9: "CPT", // Cape Town
    10: "DXB", // Dubai
    11: "MLE", // Maldives
    12: "BKK", // Bangkok
    13: "VCE", // Venice
    14: "GIG", // Rio de Janeiro
    15: "JRO", // Serengeti (Kilimanjaro Airport)
    16: "ROM", // Rome
    17: "SIN", // Singapore
    18: "REK", // Iceland
    19: "HKG", // Hong Kong
    20: "CDG", // Paris
    21: "MEX", // Mexico City
    22: "DEL", // New Delhi
    23: "LIS", // Lisbon
    24: "BUD", // Budapest
    25: "PRG", // Prague
    26: "IST", // Istanbul
    27: "AKL", // Auckland
    28: "EZE", // Patagonia (Buenos Aires)
    29: "BGO", // Norwegian Fjords (Bergen)
  };
  
  // Function to fetch flight price estimates from the Skyscanner API via our backend
  const fetchFlightEstimate = async () => {
    if (!destinationId || !startDate || !endDate || !includeFlights) return;
    
    // Set destination airport code based on selected destination
    const destAirport = destinationAirports[destinationId];
    if (!destAirport) {
      console.log("No airport code for destination ID:", destinationId);
      return;
    }
    
    setDestinationAirport(destAirport);
    setIsFetchingFlightCost(true);
    
    try {
      console.log("Fetching flight price estimate with params:", {
        origin: originAirport,
        destination: destAirport,
        departureDate: startDate,
        returnDate: endDate,
        travelers: numTravelers
      });
      
      const response = await fetch(`/api/budget/flight-estimate?origin=${originAirport}&destination=${destAirport}&departureDate=${startDate}&returnDate=${endDate}&travelers=${numTravelers}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch flight estimate");
      }
      
      const data = await response.json();
      console.log("Flight cost estimate received:", data);
      
      setFlightCostEstimate({
        price: data.price || data.avgPrice || (500 * numTravelers),
        currency: data.currency || "USD",
        isEstimate: !data.price || data.isEstimate
      });
      
    } catch (error) {
      console.error("Error fetching flight estimate:", error);
      // Set a fallback estimate
      setFlightCostEstimate({
        price: 500 * numTravelers,
        currency: 'USD',
        isEstimate: true
      });
    } finally {
      setIsFetchingFlightCost(false);
    }
  };
  
  // Update airport code when destination changes
  useEffect(() => {
    if (destinationId && destinationAirports[destinationId]) {
      const airport = destinationAirports[destinationId];
      console.log(`Setting destination airport to ${airport} for destination ID ${destinationId}`);
      setDestinationAirport(airport);
    }
  }, [destinationId]);
  
  // Fetch flight estimates when parameters change and flights are included
  useEffect(() => {
    if (includeFlights && destinationId && startDate && endDate && originAirport && destinationAirport) {
      console.log("Parameters changed, fetching new flight estimate");
      fetchFlightEstimate();
    }
  }, [destinationId, startDate, endDate, includeFlights, numTravelers]);
  
  // Recalculate budget when flight cost estimate changes
  useEffect(() => {
    if (destinationId && startDate && endDate && calculateDays() > 0) {
      console.log("Flight cost estimate changed, recalculating budget");
      calculateBudget();
    }
  }, [flightCostEstimate]);
  
  // Calculate trip duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Add one day to include the last day
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    return days > 0 ? days : 0;
  };
  
  // Handle calculation of the budget
  const calculateBudget = () => {
    console.log("Calculating budget with cost data:", costData);
    
    if (!costData || !destinationId) {
      console.log("Missing cost data or destination ID");
      return;
    }
    
    // Find the cost data for the selected destination
    let selectedCost = Array.isArray(costData) 
      ? costData.find(cost => cost.destinationId === destinationId)
      : null;
      
    console.log("Selected cost data for destination ID", destinationId, ":", selectedCost);
    
    // If no cost data is found, create an estimated cost based on the destination's continent
    if (!selectedCost && destinations) {
      console.log("No specific cost data found, creating regional estimate");
      
      // Find the destination to get its continent
      const destination = destinations.find(d => d.id === destinationId);
      if (!destination) {
        console.log("Could not find destination information");
        return;
      }
      
      // Find a similar destination in the same continent to use as a base
      const similarDestination = Array.isArray(costData) 
        ? costData.find(cost => {
            const dest = destinations.find(d => d.id === cost.destinationId);
            return dest && dest.continent === destination.continent;
          })
        : null;
      
      if (similarDestination) {
        console.log("Using similar destination as base:", similarDestination);
        // Create an estimated cost data based on the similar destination
        selectedCost = {
          ...similarDestination,
          destinationId,
          currency: similarDestination.currency
        };
      } else {
        // Fallback to USD-based default values if no similar destination exists
        console.log("No similar destination found, using global defaults");
        selectedCost = {
          id: 0,
          destinationId,
          currency: "USD",
          budgetAccommodation: 50,
          midrangeAccommodation: 120,
          luxuryAccommodation: 300,
          budgetMeal: 15,
          midrangeMeal: 30,
          fineDiningMeal: 70,
          publicTransport: 10,
          taxiRide: 25,
          carRental: 50,
          attractionTicket: 15,
          localTour: 80,
          seasonalMultipliers: {
            summer: 1.0,
            winter: 1.0,
            spring: 1.0,
            fall: 1.0
          },
          lastUpdated: new Date()
        };
      }
    }
    
    const numDays = calculateDays();
    console.log("Number of days calculated:", numDays);
    
    if (numDays <= 0) {
      console.log("Days calculation returned 0 or negative value");
      return;
    }
    
    // Ensure we have valid cost data
    if (!selectedCost) {
      console.error("No cost data available for calculation");
      return;
    }
    
    // Calculate accommodation costs based on preference
    let accommodationCost = 0;
    if (accommodationType === "budget") {
      accommodationCost = selectedCost.budgetAccommodation * numDays;
    } else if (accommodationType === "midrange") {
      accommodationCost = selectedCost.midrangeAccommodation * numDays;
    } else {
      accommodationCost = selectedCost.luxuryAccommodation * numDays;
    }
    console.log("Accommodation cost:", accommodationCost);
    
    // Calculate food costs based on preference
    let foodCost = 0;
    if (mealPreference === "budget") {
      foodCost = selectedCost.budgetMeal * 3 * numDays; // 3 meals per day
    } else if (mealPreference === "mixed") {
      foodCost = (selectedCost.budgetMeal + selectedCost.midrangeMeal + selectedCost.budgetMeal) * numDays; // mix of meal types
    } else {
      foodCost = (selectedCost.midrangeMeal * 2 + selectedCost.fineDiningMeal) * numDays; // 2 regular + 1 fine dining
    }
    console.log("Food cost:", foodCost);
    
    // Transportation costs
    let transportationCost = 0;
    if (transportationType === "public") {
      transportationCost = selectedCost.publicTransport * numDays;
    } else if (transportationType === "taxi") {
      transportationCost = selectedCost.taxiRide * numDays;
    } else {
      transportationCost = selectedCost.carRental * numDays;
    }
    console.log("Transportation cost:", transportationCost);
    
    // Activities costs - tours, attractions, entertainment
    const activitiesCost = (selectedCost.attractionTicket * 2 + selectedCost.localTour * addedActivities) * numDays;
    console.log("Activities cost:", activitiesCost);
    
    // Flight costs - using Skyscanner estimate or fallback
    let flightCost = 0;
    if (includeFlights) {
      if (flightCostEstimate && flightCostEstimate.price > 0) {
        // Use the estimate from our API
        flightCost = flightCostEstimate.price;
        console.log("Using flight cost estimate from Skyscanner API:", flightCost);
      } else {
        // Fallback to default estimate if no estimate available
        flightCost = 500 * numTravelers;
        console.log("Using fallback flight cost estimate:", flightCost);
      }
    } else {
      console.log("Flights not included in budget");
    }
    console.log("Final flight cost used in calculation:", flightCost);
    
    // Miscellaneous costs - souvenirs, emergencies, etc.
    const baseCost = accommodationCost + foodCost + transportationCost + activitiesCost;
    const miscellaneousCost = (baseCost * (emergencyFundPercentage / 100));
    console.log("Miscellaneous cost:", miscellaneousCost);
    
    // Calculate total and per person costs
    const totalCost = accommodationCost + foodCost + transportationCost + activitiesCost + miscellaneousCost + flightCost;
    const perPersonCost = totalCost / numTravelers;
    const perDayCost = totalCost / numDays;
    
    console.log("Total cost:", totalCost);
    console.log("Per person cost:", perPersonCost);
    console.log("Per day cost:", perDayCost);
    
    // Check if we're using estimated cost data
    const isUsingEstimatedCosts = !costData?.some(cost => cost.destinationId === destinationId);
    
    // Set the calculated budget
    setBudgetCalculation({
      totalBudget: totalCost,
      perPersonBudget: perPersonCost,
      perDayBudget: perDayCost,
      numDays,
      currency: selectedCost?.currency || 'USD',
      breakdown: {
        accommodation: accommodationCost,
        food: foodCost,
        transportation: transportationCost,
        activities: activitiesCost,
        miscellaneous: miscellaneousCost,
        flights: flightCost
      },
      isEstimated: isUsingEstimatedCosts
    });
    
    console.log("Budget calculation set:", {
      totalBudget: totalCost,
      perPersonBudget: perPersonCost,
      perDayBudget: perDayCost,
      numDays,
      currency: selectedCost.currency || 'USD'
    });
  };
  
  // Format currency amount according to local format
  const formatCurrency = (amount: number, currency?: string) => {
    // Handle NaN or undefined values
    if (isNaN(amount) || amount === undefined) {
      return '$0.00';
    }
    
    // Default to USD if currency is undefined
    const currencyCode = currency || 'USD';
    
    if (currencyCode === "IDR") {
      // Format Indonesian Rupiah with no decimal places
      return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currencyCode 
    }).format(amount);
  };
  
  // Convert currency to USD
  const convertToUSD = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === "USD") return amount;
    
    // Approximate exchange rates as of May 2024
    const exchangeRates: Record<string, number> = {
      "EUR": 1.08, // 1 EUR = 1.08 USD
      "JPY": 0.0066, // 1 JPY = 0.0066 USD
      "CHF": 1.12, // 1 CHF = 1.12 USD
      "IDR": 0.000064, // 1 IDR = 0.000064 USD
      "THB": 0.028, // 1 THB = 0.028 USD
      "GBP": 1.27, // 1 GBP = 1.27 USD
      "AUD": 0.66, // 1 AUD = 0.66 USD
      "CAD": 0.74, // 1 CAD = 0.74 USD
      "NZD": 0.61, // 1 NZD = 0.61 USD
      "SGD": 0.75, // 1 SGD = 0.75 USD
      "MYR": 0.22, // 1 MYR = 0.22 USD
      "PHP": 0.018, // 1 PHP = 0.018 USD
      "VND": 0.000041, // 1 VND = 0.000041 USD
      "CNY": 0.14, // 1 CNY = 0.14 USD
      "MXN": 0.06, // 1 MXN = 0.06 USD
      "ISK": 0.0073, // 1 ISK = 0.0073 USD (Icelandic Krona)
      "MAD": 0.10, // 1 MAD = 0.10 USD (Moroccan Dirham)
      "PEN": 0.27, // 1 PEN = 0.27 USD (Peruvian Sol)
      "ZAR": 0.055, // 1 ZAR = 0.055 USD (South African Rand)
      "AED": 0.27, // 1 AED = 0.27 USD (UAE Dirham)
      "MVR": 0.065, // 1 MVR = 0.065 USD (Maldivian Rufiyaa)
      "BRL": 0.19, // 1 BRL = 0.19 USD (Brazilian Real)
      "TZS": 0.00039, // 1 TZS = 0.00039 USD (Tanzanian Shilling)
      "HKD": 0.13, // 1 HKD = 0.13 USD (Hong Kong Dollar)
      "INR": 0.012, // 1 INR = 0.012 USD (Indian Rupee)
      "CZK": 0.044, // 1 CZK = 0.044 USD (Czech Koruna)
      "HUF": 0.0027, // 1 HUF = 0.0027 USD (Hungarian Forint)
      "TRY": 0.031, // 1 TRY = 0.031 USD (Turkish Lira)
      "NOK": 0.093, // 1 NOK = 0.093 USD (Norwegian Krone)
      "ARS": 0.0011, // 1 ARS = 0.0011 USD (Argentine Peso)
    };
    
    const rate = exchangeRates[fromCurrency] || 1;
    return amount * rate;
  };
  
  // Prepare chart data for the budget breakdown
  const prepareBudgetChartData = () => {
    if (!budgetCalculation) return [];
    
    const { breakdown } = budgetCalculation;
    return [
      { name: 'Accommodation', value: breakdown.accommodation },
      { name: 'Food', value: breakdown.food },
      { name: 'Transportation', value: breakdown.transportation },
      { name: 'Activities', value: breakdown.activities },
      { name: 'Miscellaneous', value: breakdown.miscellaneous },
      { name: 'Flights', value: breakdown.flights }
    ];
  };
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];
  
  // Generate saving timeline data - how much to save per month
  const generateSavingTimeline = () => {
    if (!budgetCalculation) return [];
    
    const { totalBudget } = budgetCalculation;
    return [
      { name: "12 months", amount: totalBudget / 12 },
      { name: "6 months", amount: totalBudget / 6 },
      { name: "3 months", amount: totalBudget / 3 }
    ];
  };
  
  // Reset form to default values
  const resetForm = () => {
    setDestinationId(null);
    setAccommodationType("midrange");
    setMealPreference("mixed");
    setTransportationType("public");
    setNumTravelers(2);
    setIncludeFlights(true);
    setStartDate("");
    setEndDate("");
    setAddedActivities(1);
    setEmergencyFundPercentage(10);
    setBudgetCalculation(null);
  };
  
  // State for the save budget dialog
  const [budgetName, setBudgetName] = useState("");
  const [budgetNotes, setBudgetNotes] = useState("");
  
  // Function to save travel plan
  const handleSaveTravelPlan = async () => {
    if (!user || !budgetCalculation) {
      toast({
        title: "Error",
        description: "Please make sure you're logged in and have calculated a budget.",
        variant: "destructive",
      });
      return;
    }

    const selectedDestination = destinations?.find(d => d.id === destinationId);
    if (!selectedDestination) {
      toast({
        title: "Error",
        description: "Please select a destination first.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const travelPlanData = {
        name: planName || `Trip to ${selectedDestination.name}`,
        destinationId: selectedDestination.id,
        startDate,
        endDate,
        accommodationType,
        mealPreference,
        transportationType,
        numTravelers,
        totalBudget: budgetCalculation.totalBudget,
        perPersonBudget: budgetCalculation.totalBudget / numTravelers,
        currency: budgetCalculation.currency,
        activitiesBudget: budgetCalculation.breakdown.activities || 0,
        dailyBudget: budgetCalculation.totalBudget / Math.max(1, 
          Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
        ),
        notes: budgetNotes,
        isPublic: planIsPublic,
        miscExpenses: budgetCalculation.breakdown.miscellaneous || 0
      };

      const response = await apiRequest("POST", "/api/travel-plans", travelPlanData);
      
      if (response.ok) {
        toast({
          title: "Success! 🎉",
          description: "Your travel plan has been saved to your dashboard!",
        });
        setShowSaveDialog(false);
        setPlanName("");
        setBudgetNotes("");
        setPlanIsPublic(false);
      } else {
        throw new Error("Failed to save travel plan");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save travel plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Function to open the save budget dialog
  const openSaveBudgetDialog = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save budgets",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a default name based on the destination
    if (destinationId && destinations) {
      const destination = destinations.find(d => d.id === destinationId);
      if (destination) {
        const defaultName = `${destination.name} Trip - ${formatCurrency(budgetCalculation?.totalBudget || 0, budgetCalculation?.currency || 'USD')}`;
        setBudgetName(defaultName);
      }
    }
    
    setShowSaveDialog(true);
  };
  
  // Function to save the budget to the user's account
  const saveBudget = async () => {
    if (!user || !budgetCalculation || !destinationId) {
      toast({
        title: "Cannot save budget",
        description: "Missing required information",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const budgetData = {
        name: budgetName,
        userId: user.id,
        destinationId,
        startDate,
        endDate,
        numTravelers,
        accommodationType,
        mealPreference,
        transportationType,
        activitiesBudget: budgetCalculation.breakdown.activities,
        miscExpenses: budgetCalculation.breakdown.miscellaneous,
        currency: budgetCalculation.currency,
        totalBudget: budgetCalculation.totalBudget,
        dailyBudget: budgetCalculation.perDayBudget,
        perPersonBudget: budgetCalculation.perPersonBudget,
        notes: budgetNotes,
        isPublic: false
      };
      
      const response = await apiRequest("POST", "/api/travel-budgets", budgetData);
      
      if (!response.ok) {
        throw new Error("Failed to save budget");
      }
      
      const savedBudget = await response.json();
      
      toast({
        title: "Budget saved!",
        description: "Your travel budget has been saved to your account",
      });
      
      setShowSaveDialog(false);
      setBudgetName("");
      setBudgetNotes("");
    } catch (error) {
      console.error("Error saving budget:", error);
      toast({
        title: "Failed to save budget",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // When costData changes, recalculate budget
  useEffect(() => {
    if (costData && destinationId && startDate && endDate) {
      calculateBudget();
    }
  }, [costData, destinationId, accommodationType, mealPreference, transportationType, 
      numTravelers, includeFlights, startDate, endDate, addedActivities, emergencyFundPercentage]);
  
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black">Travel Budget Calculator</h1>
        <p className="text-muted-foreground mt-2">Plan your trip finances with precision and confidence</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Calculator Form */}
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <span>Budget Estimation Tool</span>
              </CardTitle>
              <CardDescription>Fill in your trip details to calculate your travel budget</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Destination selection */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Select 
                  value={destinationId?.toString() || ""} 
                  onValueChange={(val) => setDestinationId(parseInt(val))}
                >
                  <SelectTrigger id="destination">
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations?.map((destination) => {
                      const hasCostData = costData?.some(cost => cost.destinationId === destination.id);
                      return (
                        <SelectItem key={destination.id} value={destination.id.toString()}>
                          {destination.name} {!hasCostData && "(Est.)"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Travel dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="startDate"
                      type="date" 
                      className="pl-10" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="endDate"
                      type="date" 
                      className="pl-10" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Number of travelers */}
              <div className="space-y-2">
                <Label htmlFor="travelers">Number of Travelers</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="travelers"
                    type="number" 
                    min="1" 
                    className="pl-10" 
                    value={numTravelers} 
                    onChange={(e) => setNumTravelers(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              
              {/* Manual calculation button */}
              <Button 
                type="button" 
                className="w-full"
                onClick={() => {
                  console.log("Manual budget calculation triggered");
                  calculateBudget();
                }}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Budget
              </Button>
              
              {/* Accommodation preference */}
              <div className="space-y-2">
                <Label htmlFor="accommodation">Accommodation Type</Label>
                <Select value={accommodationType} onValueChange={setAccommodationType}>
                  <SelectTrigger id="accommodation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget (Hostels, Guesthouses)</SelectItem>
                    <SelectItem value="midrange">Mid-range (3-star Hotels)</SelectItem>
                    <SelectItem value="luxury">Luxury (4-5 star Hotels, Resorts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Meal preference */}
              <div className="space-y-2">
                <Label htmlFor="meals">Meal Preference</Label>
                <Select value={mealPreference} onValueChange={setMealPreference}>
                  <SelectTrigger id="meals">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget (Street food, Self-catering)</SelectItem>
                    <SelectItem value="mixed">Mixed (Some restaurants, Some budget options)</SelectItem>
                    <SelectItem value="fineDining">Fine dining (Restaurants, Cafes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Transportation type */}
              <div className="space-y-2">
                <Label htmlFor="transport">Local Transportation</Label>
                <Select value={transportationType} onValueChange={setTransportationType}>
                  <SelectTrigger id="transport">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public Transport</SelectItem>
                    <SelectItem value="taxi">Taxis/Rideshares</SelectItem>
                    <SelectItem value="rental">Car Rental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Activities slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="activities">Activities & Tours (daily)</Label>
                  <span className="text-sm text-muted-foreground">{addedActivities}</span>
                </div>
                <Slider 
                  id="activities"
                  min={0} 
                  max={3} 
                  step={1} 
                  value={[addedActivities]} 
                  onValueChange={(val) => setAddedActivities(val[0])}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Minimal</span>
                  <span>Standard</span>
                  <span>Many</span>
                  <span>Premium</span>
                </div>
              </div>
              
              {/* Flight options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeFlights"
                    checked={includeFlights}
                    onCheckedChange={(checked) => setIncludeFlights(checked === true)}
                  />
                  <label htmlFor="includeFlights" className="text-sm font-medium leading-none">
                    Include estimated flight costs
                  </label>
                </div>
                
                {includeFlights && (
                  <div className="space-y-4 p-3 border rounded-md border-dashed bg-muted/30">
                    <div className="space-y-2">
                      <Label htmlFor="originAirport">Departure Airport (IATA Code)</Label>
                      <div className="relative">
                        <Plane className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="originAirport"
                          value={originAirport} 
                          onChange={(e) => setOriginAirport(e.target.value.toUpperCase().substring(0, 3))}
                          placeholder="LAX"
                          className="pl-10 uppercase"
                          maxLength={3}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Enter the 3-letter IATA code for your departure airport</p>
                    </div>
                    
                    {destinationAirport && (
                      <div className="space-y-2">
                        <Label htmlFor="destinationAirport">Destination Airport</Label>
                        <div className="relative">
                          <Plane className="absolute left-3 top-3 h-4 w-4 rotate-90 text-muted-foreground" />
                          <Input 
                            id="destinationAirport"
                            value={destinationAirport} 
                            readOnly
                            className="pl-10 bg-muted/50 uppercase"
                          />
                        </div>
                      </div>
                    )}
                    
                    {flightCostEstimate && (
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">Flight cost:</span>
                            {flightCostEstimate.isEstimate ? (
                              <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-amber-50 border-amber-200 text-amber-700">Estimate</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-green-50 border-green-200 text-green-700">Live Price</Badge>
                            )}
                          </div>
                          <span className="font-medium">
                            {formatCurrency(flightCostEstimate.price, flightCostEstimate.currency)}
                          </span>
                        </div>
                        
                        <div className="bg-muted/40 p-1.5 rounded-sm text-xs flex flex-col space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center">
                                <Plane className="h-3 w-3" />
                              </div>
                              <span>{originAirport}</span>
                            </div>
                            <div className="text-muted-foreground text-[10px]">Departure</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center">
                                <Plane className="h-3 w-3 rotate-90" />
                              </div>
                              <span>{destinationAirport}</span>
                            </div>
                            <div className="text-muted-foreground text-[10px]">Arrival</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center">
                                <Users className="h-3 w-3" />
                              </div>
                              <span>{numTravelers} {numTravelers === 1 ? 'Traveler' : 'Travelers'}</span>
                            </div>
                            <div className="text-muted-foreground text-[10px]">Round trip</div>
                          </div>
                        </div>
                        
                        {flightCostEstimate.isEstimate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            This price is estimated based on typical fares for this route and season. Check airline websites for actual prices.
                          </p>
                        )}
                      </div>
                    )}
                    
                    {isFetchingFlightCost && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full"></div>
                        <span>Fetching flight prices...</span>
                      </div>
                    )}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => fetchFlightEstimate()}
                      disabled={!startDate || !endDate || !originAirport || !destinationAirport || isFetchingFlightCost}
                    >
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Update Flight Price
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Advanced settings */}
              <div>
                <button 
                  type="button" 
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span>{showAdvanced ? "Hide" : "Show"} advanced settings</span>
                  <Info className="h-3 w-3" />
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 space-y-4 border rounded-md p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="emergency">Emergency Fund (%)</Label>
                        <span className="text-sm text-muted-foreground">{emergencyFundPercentage}%</span>
                      </div>
                      <Slider 
                        id="emergency"
                        min={0} 
                        max={30} 
                        step={5} 
                        value={[emergencyFundPercentage]} 
                        onValueChange={(val) => setEmergencyFundPercentage(val[0])}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>0%</span>
                        <span>15%</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button 
                onClick={() => {
                  console.log("Manual budget calculation triggered");
                  calculateBudget();
                }}
                disabled={!destinationId || !startDate || !endDate}
              >
                Calculate Budget
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Results Section */}
        <div className="md:col-span-7">
          {!budgetCalculation && !isCostDataLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
              <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Your Travel Budget</h3>
              <p className="text-muted-foreground mt-2">
                Fill in the details on the left to see your estimated travel budget
              </p>
            </div>
          )}
          
          {isCostDataLoading && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading cost data...</p>
            </div>
          )}
          
          {budgetCalculation && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                <TabsTrigger value="saving">Saving</TabsTrigger>
                <TabsTrigger value="seasonal">Best Times</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Budget Summary</span>
                    </CardTitle>
                    <CardDescription>
                      Estimated costs for{" "}
                      <Badge variant="outline">{budgetCalculation.numDays} days</Badge>{" "}
                      with{" "}
                      <Badge variant="outline">{numTravelers} {numTravelers === 1 ? "traveler" : "travelers"}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Currency selector */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">View in:</span>
                        <div className="flex items-center gap-3">
                          <div
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm cursor-pointer ${
                              displayCurrency === "local" 
                                ? "bg-primary text-white font-medium" 
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              console.log("Switching to local currency:", budgetCalculation.currency);
                              setDisplayCurrency("local");
                            }}
                          >
                            {budgetCalculation.currency}
                          </div>
                          <div
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm cursor-pointer ${
                              displayCurrency === "USD" 
                                ? "bg-primary text-white font-medium" 
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              console.log("Switching to USD");
                              setDisplayCurrency("USD");
                            }}
                          >
                            USD
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {displayCurrency === "local" 
                          ? `Showing in ${budgetCalculation.currency} with USD conversion` 
                          : `Showing in USD with ${budgetCalculation.currency} conversion`}
                      </p>
                    </div>
                    
                    {/* Total cost */}
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground">Total Estimated Budget</p>
                        {budgetCalculation.isEstimated && (
                          <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-700">Regional Estimate</Badge>
                        )}
                      </div>
                      <div className="text-3xl font-bold mt-1 text-primary">
                        {displayCurrency === "local" 
                          ? formatCurrency(budgetCalculation.totalBudget, budgetCalculation.currency)
                          : formatCurrency(convertToUSD(budgetCalculation.totalBudget, budgetCalculation.currency), "USD")}
                      </div>
                      {displayCurrency === "local" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ~{formatCurrency(convertToUSD(budgetCalculation.totalBudget, budgetCalculation.currency), "USD")}
                        </p>
                      )}
                      {displayCurrency === "USD" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ~{formatCurrency(budgetCalculation.totalBudget, budgetCalculation.currency)}
                        </p>
                      )}
                    </div>
                    
                    {/* Per person and daily costs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Per Person</p>
                        <div className="text-xl font-semibold mt-1">
                          {displayCurrency === "local" 
                            ? formatCurrency(budgetCalculation.perPersonBudget, budgetCalculation.currency)
                            : formatCurrency(convertToUSD(budgetCalculation.perPersonBudget, budgetCalculation.currency), "USD")}
                        </div>
                        {displayCurrency === "local" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ~{formatCurrency(convertToUSD(budgetCalculation.perPersonBudget, budgetCalculation.currency), "USD")}
                          </p>
                        )}
                        {displayCurrency === "USD" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ~{formatCurrency(budgetCalculation.perPersonBudget, budgetCalculation.currency)}
                          </p>
                        )}
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Per Day</p>
                        <div className="text-xl font-semibold mt-1">
                          {displayCurrency === "local" 
                            ? formatCurrency(budgetCalculation.perDayBudget, budgetCalculation.currency)
                            : formatCurrency(convertToUSD(budgetCalculation.perDayBudget, budgetCalculation.currency), "USD")}
                        </div>
                        {displayCurrency === "local" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ~{formatCurrency(convertToUSD(budgetCalculation.perDayBudget, budgetCalculation.currency), "USD")}
                          </p>
                        )}
                        {displayCurrency === "USD" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ~{formatCurrency(budgetCalculation.perDayBudget, budgetCalculation.currency)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Save Budget Button */}
                    <div className="mt-4">
                      <Button
                        onClick={openSaveBudgetDialog}
                        className="w-full"
                        variant="default"
                      >
                        <BookmarkPlus className="mr-2 h-4 w-4" />
                        Save This Budget Plan
                      </Button>
                      {!user && (
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          Log in to save your budget plans
                        </p>
                      )}
                    </div>
                    
                    {/* Save Budget Dialog */}
                    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Save Budget Plan</DialogTitle>
                          <DialogDescription>
                            Save this budget calculation to your account for future reference.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="budget-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="budget-name"
                              value={budgetName}
                              onChange={(e) => setBudgetName(e.target.value)}
                              className="col-span-3"
                              placeholder="My Bali Trip Budget"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="budget-notes" className="text-right">
                              Notes
                            </Label>
                            <textarea
                              id="budget-notes"
                              value={budgetNotes}
                              onChange={(e) => setBudgetNotes(e.target.value)}
                              className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Optional notes about this budget"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={saveBudget} disabled={isSaving || !budgetName}>
                            {isSaving ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Budget
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    {/* Cost indicators */}
                    <div className="space-y-3 pt-2">
                      <p className="text-sm font-medium">Top Expenses:</p>
                      {Object.entries(budgetCalculation.breakdown)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([category, amount]) => (
                          <div key={category} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                              <span className="capitalize">{category}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span>
                                {displayCurrency === "local" 
                                  ? formatCurrency(amount, budgetCalculation.currency)
                                  : formatCurrency(convertToUSD(amount, budgetCalculation.currency), "USD")}
                              </span>
                              {displayCurrency === "local" && (
                                <span className="text-xs text-muted-foreground">
                                  ~{formatCurrency(convertToUSD(amount, budgetCalculation.currency), "USD")}
                                </span>
                              )}
                              {displayCurrency === "USD" && (
                                <span className="text-xs text-muted-foreground">
                                  ~{formatCurrency(amount, budgetCalculation.currency)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    
                    {/* Quick saving suggestion */}
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertTitle>Saving Timeline</AlertTitle>
                      <AlertDescription>
                        Save {displayCurrency === "local" 
                          ? formatCurrency(budgetCalculation.totalBudget / 6, budgetCalculation.currency)
                          : formatCurrency(convertToUSD(budgetCalculation.totalBudget / 6, budgetCalculation.currency), "USD")
                        } per month for 6 months to fund this trip.
                        {displayCurrency === "local" && (
                          <div className="text-xs text-muted-foreground mt-1">
                            ~{formatCurrency(convertToUSD(budgetCalculation.totalBudget / 6, budgetCalculation.currency), "USD")} per month
                          </div>
                        )}
                        {displayCurrency === "USD" && (
                          <div className="text-xs text-muted-foreground mt-1">
                            ~{formatCurrency(budgetCalculation.totalBudget / 6, budgetCalculation.currency)} per month
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
                
                {/* Travel recommendations */}
                {costData && destinationId && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Destination Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="font-medium">Best time to visit:</span> Any time
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="font-medium">Currency:</span> {Array.isArray(costData) ? costData.find(cost => cost.destinationId === destinationId)?.currency || "USD" : "USD"}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="font-medium">Budget tip:</span> Consider traveling during shoulder season for better deals on accommodations and fewer crowds.
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Breakdown Tab */}
              <TabsContent value="breakdown">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Cost Breakdown</CardTitle>
                    <CardDescription>See where your travel budget will be spent</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Currency selector */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">View in:</span>
                        <div className="flex items-center gap-3">
                          <div
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm cursor-pointer ${
                              displayCurrency === "local" 
                                ? "bg-primary text-white font-medium" 
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              console.log("Switching to local currency:", budgetCalculation.currency);
                              setDisplayCurrency("local");
                            }}
                          >
                            {budgetCalculation.currency}
                          </div>
                          <div
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm cursor-pointer ${
                              displayCurrency === "USD" 
                                ? "bg-primary text-white font-medium" 
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                            onClick={() => {
                              console.log("Switching to USD");
                              setDisplayCurrency("USD");
                            }}
                          >
                            USD
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {displayCurrency === "local" 
                          ? `Showing in ${budgetCalculation.currency} with USD conversion` 
                          : `Showing in USD with ${budgetCalculation.currency} conversion`}
                      </p>
                    </div>
                    
                    {/* Pie chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareBudgetChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {prepareBudgetChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => {
                              if (displayCurrency === "local") {
                                return [formatCurrency(value, budgetCalculation.currency), "Amount"];
                              } else {
                                return [formatCurrency(convertToUSD(value, budgetCalculation.currency), "USD"), "Amount"];
                              }
                            }} 
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <Separator />
                    
                    {/* Detailed breakdown table */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Expense Details</h3>
                      
                      {/* Currency selector */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">View in:</span>
                          <div className="flex items-center gap-3">
                            <div
                              className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm cursor-pointer ${
                                displayCurrency === "local" 
                                  ? "bg-primary text-white font-medium" 
                                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              }`}
                              onClick={() => {
                                console.log("Switching to local currency:", budgetCalculation.currency);
                                setDisplayCurrency("local");
                              }}
                            >
                              {budgetCalculation.currency}
                            </div>
                            <div
                              className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm cursor-pointer ${
                                displayCurrency === "USD" 
                                  ? "bg-primary text-white font-medium" 
                                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              }`}
                              onClick={() => {
                                console.log("Switching to USD");
                                setDisplayCurrency("USD");
                              }}
                            >
                              USD
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {displayCurrency === "local" 
                            ? `Showing in ${budgetCalculation.currency} with USD conversion` 
                            : `Showing in USD with ${budgetCalculation.currency} conversion`}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(budgetCalculation.breakdown).map(([category, amount]) => {
                          // Calculate the USD amount if needed
                          const usdAmount = budgetCalculation.currency !== "USD" 
                            ? convertToUSD(amount, budgetCalculation.currency) 
                            : amount;
                            
                          // Display either local currency or USD based on selection
                          const displayAmount = displayCurrency === "local" 
                            ? formatCurrency(amount, budgetCalculation.currency)
                            : formatCurrency(usdAmount, "USD");
                          
                          return (
                            <div key={category} className="flex justify-between py-2 border-b border-muted">
                              <div className="flex items-center gap-2">
                                {category === "accommodation" && <Home className="h-4 w-4 text-primary" />}
                                {category === "food" && <Utensils className="h-4 w-4 text-primary" />}
                                {category === "transportation" && <Car className="h-4 w-4 text-primary" />}
                                {category === "activities" && <Ticket className="h-4 w-4 text-primary" />}
                                {category === "miscellaneous" && <ShoppingBag className="h-4 w-4 text-primary" />}
                                {category === "flights" && <Plane className="h-4 w-4 text-primary" />}
                                <div>
                                  <span className="capitalize">{category}</span>
                                  
                                  {/* Show flight details when viewing flight costs */}
                                  {category === "flights" && includeFlights && (
                                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                      <span>{originAirport}</span>
                                      <ArrowRight className="h-3 w-3" />
                                      <span>{destinationAirport}</span>
                                      {flightCostEstimate?.isEstimate && (
                                        <Badge variant="outline" className="h-4 text-[10px] px-1 border-amber-200 text-amber-700 bg-amber-50 ml-1">Estimate</Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{displayAmount}</div>
                                {displayCurrency === "local" && budgetCalculation.currency !== "USD" && (
                                  <div className="text-xs text-muted-foreground">
                                    {formatCurrency(usdAmount, "USD")}
                                  </div>
                                )}
                                {displayCurrency === "USD" && budgetCalculation.currency !== "USD" && (
                                  <div className="text-xs text-muted-foreground">
                                    {formatCurrency(amount, budgetCalculation.currency)}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="flex justify-between py-2 font-bold border-t-2 border-primary">
                          <span>Total</span>
                          <div className="text-right">
                            {displayCurrency === "local" ? (
                              <>
                                <div>{formatCurrency(budgetCalculation.totalBudget, budgetCalculation.currency)}</div>
                                {budgetCalculation.currency !== "USD" && (
                                  <div className="text-sm text-muted-foreground">
                                    {formatCurrency(convertToUSD(budgetCalculation.totalBudget, budgetCalculation.currency), "USD")}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div>{formatCurrency(convertToUSD(budgetCalculation.totalBudget, budgetCalculation.currency), "USD")}</div>
                                {budgetCalculation.currency !== "USD" && (
                                  <div className="text-sm text-muted-foreground">
                                    {formatCurrency(budgetCalculation.totalBudget, budgetCalculation.currency)}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Save Travel Plan Section */}
                    {user && (
                      <div className="mt-6 p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-blue-900">Save This Travel Plan</h3>
                            <p className="text-sm text-blue-700 mt-1">
                              Save this budget calculation to your dashboard for future reference
                            </p>
                          </div>
                          <Button
                            onClick={() => setShowSaveDialog(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Save Plan
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {!user && (
                      <div className="mt-6 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <div className="text-center">
                          <h3 className="font-medium text-gray-900">Want to save this plan?</h3>
                          <p className="text-sm text-gray-600 mt-1 mb-3">
                            Sign in to save your budget calculations and access them anytime
                          </p>
                          <Button variant="outline" onClick={() => window.location.href = '/auth'}>
                            Sign In to Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Saving Plan Tab */}
              <TabsContent value="saving">
                <Card>
                  <CardHeader>
                    <CardTitle>Saving Timeline</CardTitle>
                    <CardDescription>How much to save monthly based on your timeframe</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Bar chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={generateSavingTimeline()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis 
                            tickFormatter={(value) => 
                              formatCurrency(value, budgetCalculation.currency).split('.')[0]
                            } 
                          />
                          <Tooltip 
                            formatter={(value: number) => [
                              formatCurrency(value, budgetCalculation.currency), 
                              "Monthly Savings"
                            ]} 
                          />
                          <Bar 
                            dataKey="amount" 
                            fill="#2d8a9a" 
                            name="Monthly Savings"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <Separator />
                    
                    {/* Saving tips */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Saving Tips</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Set up a dedicated travel savings account</li>
                        <li>Automate monthly transfers to your travel fund</li>
                        <li>Look for flight deals in advance</li>
                        <li>Consider travel credit cards with points and benefits</li>
                        <li>Book accommodations early for better rates</li>
                      </ul>
                    </div>
                    
                    {/* Extra costs warning */}
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Remember</AlertTitle>
                      <AlertDescription>
                        Add extra for souvenirs, unexpected expenses, and special experiences. A {emergencyFundPercentage}% buffer 
                        has been included in your total.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Best Times to Travel Tab */}
              <TabsContent value="seasonal">
                <Card>
                  <CardHeader>
                    <CardTitle>Best Times to Travel</CardTitle>
                    <CardDescription>Discover optimal timing for your trip with seasonal pricing and weather insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Seasonal pricing chart */}
                    <div>
                      <h3 className="font-medium mb-4">Seasonal Price Trends</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { season: "Winter", price: budgetCalculation.totalBudget * 0.85, months: "Dec-Feb", crowds: "Low", weather: "Cool" },
                              { season: "Spring", price: budgetCalculation.totalBudget * 0.95, months: "Mar-May", crowds: "Medium", weather: "Mild" },
                              { season: "Summer", price: budgetCalculation.totalBudget * 1.25, months: "Jun-Aug", crowds: "High", weather: "Warm" },
                              { season: "Fall", price: budgetCalculation.totalBudget * 1.05, months: "Sep-Nov", crowds: "Medium", weather: "Pleasant" }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="season" />
                            <YAxis 
                              tickFormatter={(value) => 
                                formatCurrency(value, budgetCalculation.currency).split('.')[0]
                              } 
                            />
                            <Tooltip 
                              formatter={(value: number) => [
                                formatCurrency(value, budgetCalculation.currency), 
                                "Estimated Cost"
                              ]}
                              labelFormatter={(label) => `${label} Season`}
                            />
                            <Bar 
                              dataKey="price" 
                              fill="#2d8a9a" 
                              name="Seasonal Cost"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <Separator />

                    {/* Season breakdown cards */}
                    <div>
                      <h3 className="font-medium mb-4">Season Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { 
                            season: "Winter", 
                            months: "Dec - Feb", 
                            price: budgetCalculation.totalBudget * 0.85,
                            savings: "15% cheaper",
                            crowds: "Low",
                            weather: "Cool",
                            pros: ["Lower accommodation prices", "Fewer crowds", "Authentic local experience"],
                            cons: ["Weather may be cooler", "Some attractions may have limited hours"]
                          },
                          { 
                            season: "Spring", 
                            months: "Mar - May", 
                            price: budgetCalculation.totalBudget * 0.95,
                            savings: "5% cheaper",
                            crowds: "Medium",
                            weather: "Mild",
                            pros: ["Pleasant weather", "Moderate prices", "Nature in bloom"],
                            cons: ["Some seasonal activities may not be available"]
                          },
                          { 
                            season: "Summer", 
                            months: "Jun - Aug", 
                            price: budgetCalculation.totalBudget * 1.25,
                            savings: "25% more expensive",
                            crowds: "High",
                            weather: "Warm",
                            pros: ["Best weather", "All attractions open", "Vibrant atmosphere"],
                            cons: ["Higher prices", "Crowded attractions", "Book early required"]
                          },
                          { 
                            season: "Fall", 
                            months: "Sep - Nov", 
                            price: budgetCalculation.totalBudget * 1.05,
                            savings: "5% more expensive",
                            crowds: "Medium",
                            weather: "Pleasant",
                            pros: ["Beautiful scenery", "Good weather", "Moderate crowds"],
                            cons: ["Some summer activities may end"]
                          }
                        ].map((season) => (
                          <Card key={season.season} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">{season.season}</h4>
                                <p className="text-sm text-muted-foreground">{season.months}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">
                                  {formatCurrency(season.price, budgetCalculation.currency)}
                                </div>
                                <Badge 
                                  variant={season.savings.includes('cheaper') ? 'secondary' : 'outline'}
                                  className={season.savings.includes('cheaper') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                >
                                  {season.savings}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                              <div className="text-center p-2 bg-muted rounded">
                                <div className="font-medium">Crowds</div>
                                <div className="text-muted-foreground">{season.crowds}</div>
                              </div>
                              <div className="text-center p-2 bg-muted rounded">
                                <div className="font-medium">Weather</div>
                                <div className="text-muted-foreground">{season.weather}</div>
                              </div>
                              <div className="text-center p-2 bg-muted rounded">
                                <div className="font-medium">Value</div>
                                <div className="text-muted-foreground">
                                  {season.savings.includes('cheaper') ? 'Great' : season.savings.includes('5%') ? 'Good' : 'Premium'}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <h5 className="text-sm font-medium text-green-700 mb-1">Pros:</h5>
                                <ul className="text-xs space-y-1">
                                  {season.pros.map((pro, index) => (
                                    <li key={index} className="flex items-center gap-1">
                                      <div className="h-1 w-1 rounded-full bg-green-600"></div>
                                      {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-amber-700 mb-1">Considerations:</h5>
                                <ul className="text-xs space-y-1">
                                  {season.cons.map((con, index) => (
                                    <li key={index} className="flex items-center gap-1">
                                      <div className="h-1 w-1 rounded-full bg-amber-600"></div>
                                      {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Best value recommendation */}
                    <Alert>
                      <Calendar className="h-4 w-4" />
                      <AlertTitle>💡 Best Value Recommendation</AlertTitle>
                      <AlertDescription>
                        <strong>Winter & Spring</strong> offer the best value with savings up to 15% compared to peak season. 
                        You could save approximately <strong>{formatCurrency(budgetCalculation.totalBudget * 0.4, budgetCalculation.currency)}</strong> 
                        by traveling during off-peak times while still enjoying great weather and experiences.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      
      {/* Save Travel Plan Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Travel Plan</DialogTitle>
            <DialogDescription>
              Save this budget calculation to your dashboard for future reference and comparison.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder={`Trip to ${destinations?.find(d => d.id === destinationId)?.name || 'Destination'}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planNotes">Notes (Optional)</Label>
              <Input
                id="planNotes"
                value={budgetNotes}
                onChange={(e) => setBudgetNotes(e.target.value)}
                placeholder="Add any notes about this trip..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="planPublic"
                checked={planIsPublic}
                onCheckedChange={(checked) => setPlanIsPublic(checked === true)}
              />
              <Label htmlFor="planPublic" className="text-sm">
                Make this plan public (others can see it)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTravelPlan}
              disabled={isSaving || !planName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Save Plan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}