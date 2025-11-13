import fetch from 'node-fetch';

// Additional destination cost data for popular destinations
const additionalCostData = [
  {
    destinationId: 6,  // Marrakech
    currency: "MAD",
    budgetAccommodation: 200,
    midrangeAccommodation: 600,
    luxuryAccommodation: 1500,
    budgetMeal: 50,
    midrangeMeal: 150,
    fineDiningMeal: 350,
    publicTransport: 20,
    taxiRide: 70,
    carRental: 350,
    attractionTicket: 80,
    localTour: 250,
    seasonalMultipliers: {
      summer: 1.1,
      winter: 0.9,
      spring: 1.0,
      fall: 1.0
    }
  },
  {
    destinationId: 7,  // Machu Picchu
    currency: "PEN",
    budgetAccommodation: 100,
    midrangeAccommodation: 250,
    luxuryAccommodation: 800,
    budgetMeal: 20,
    midrangeMeal: 60,
    fineDiningMeal: 150,
    publicTransport: 15,
    taxiRide: 40,
    carRental: 200,
    attractionTicket: 150,
    localTour: 350,
    seasonalMultipliers: {
      summer: 1.2,
      winter: 0.7,
      spring: 1.0,
      fall: 1.0
    }
  },
  {
    destinationId: 8,  // New York City
    currency: "USD",
    budgetAccommodation: 150,
    midrangeAccommodation: 300,
    luxuryAccommodation: 600,
    budgetMeal: 20,
    midrangeMeal: 50,
    fineDiningMeal: 150,
    publicTransport: 15,
    taxiRide: 35,
    carRental: 100,
    attractionTicket: 30,
    localTour: 120,
    seasonalMultipliers: {
      summer: 1.2,
      winter: 0.9,
      spring: 1.1,
      fall: 1.0
    }
  },
  {
    destinationId: 9,  // Cape Town
    currency: "ZAR",
    budgetAccommodation: 600,
    midrangeAccommodation: 1500,
    luxuryAccommodation: 3500,
    budgetMeal: 150,
    midrangeMeal: 350,
    fineDiningMeal: 800,
    publicTransport: 100,
    taxiRide: 250,
    carRental: 800,
    attractionTicket: 300,
    localTour: 1000,
    seasonalMultipliers: {
      summer: 1.3,
      winter: 0.8,
      spring: 1.0,
      fall: 0.9
    }
  },
  {
    destinationId: 10,  // Dubai
    currency: "AED",
    budgetAccommodation: 250,
    midrangeAccommodation: 600,
    luxuryAccommodation: 2000,
    budgetMeal: 50,
    midrangeMeal: 150,
    fineDiningMeal: 500,
    publicTransport: 20,
    taxiRide: 50,
    carRental: 200,
    attractionTicket: 150,
    localTour: 400,
    seasonalMultipliers: {
      summer: 0.7,
      winter: 1.3,
      spring: 1.1,
      fall: 1.0
    }
  }
];

async function addDestinationCosts() {
  try {
    console.log('Adding destination cost data...');
    
    for (const costData of additionalCostData) {
      const response = await fetch('http://localhost:5000/api/destination-costs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(costData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to add cost data for destination ID ${costData.destinationId}: ${errorText}`);
        continue;
      }
      
      const result = await response.json();
      console.log(`Added cost data for destination ID ${costData.destinationId}: ${result.id}`);
    }
    
    console.log('All destination cost data added successfully!');
  } catch (error) {
    console.error('Error adding destination costs:', error);
  }
}

addDestinationCosts();
