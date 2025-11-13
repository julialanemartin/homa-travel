import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addLocalCurrencies() {
  const client = await pool.connect();
  
  try {
    // Add Mexico City (MXN) cost data
    await client.query(`
      INSERT INTO destination_cost_data (
        destination_id, currency, budget_accommodation, midrange_accommodation, 
        luxury_accommodation, budget_meal, midrange_meal, fine_dining_meal,
        public_transport, taxi_ride, car_rental, attraction_ticket, local_tour,
        seasonal_multipliers, last_updated
      ) VALUES (
        25, 'MXN', 600, 1200, 3000, 150, 300, 800, 20, 80, 600, 200, 800,
        '{"summer": 1.1, "winter": 0.9, "spring": 1, "fall": 1}', NOW()
      ) ON CONFLICT (destination_id) DO UPDATE SET
        currency = EXCLUDED.currency,
        budget_accommodation = EXCLUDED.budget_accommodation,
        midrange_accommodation = EXCLUDED.midrange_accommodation,
        luxury_accommodation = EXCLUDED.luxury_accommodation,
        budget_meal = EXCLUDED.budget_meal,
        midrange_meal = EXCLUDED.midrange_meal,
        fine_dining_meal = EXCLUDED.fine_dining_meal,
        public_transport = EXCLUDED.public_transport,
        taxi_ride = EXCLUDED.taxi_ride,
        car_rental = EXCLUDED.car_rental,
        attraction_ticket = EXCLUDED.attraction_ticket,
        local_tour = EXCLUDED.local_tour,
        seasonal_multipliers = EXCLUDED.seasonal_multipliers,
        last_updated = NOW()
    `);
    
    // Add Patagonia (ARS) cost data  
    await client.query(`
      INSERT INTO destination_cost_data (
        destination_id, currency, budget_accommodation, midrange_accommodation,
        luxury_accommodation, budget_meal, midrange_meal, fine_dining_meal,
        public_transport, taxi_ride, car_rental, attraction_ticket, local_tour,
        seasonal_multipliers, last_updated
      ) VALUES (
        28, 'ARS', 8000, 15000, 35000, 2000, 4000, 10000, 300, 1200, 8000, 1500, 12000,
        '{"summer": 1.3, "winter": 0.8, "spring": 1.1, "fall": 1}', NOW()
      ) ON CONFLICT (destination_id) DO UPDATE SET
        currency = EXCLUDED.currency,
        budget_accommodation = EXCLUDED.budget_accommodation,
        midrange_accommodation = EXCLUDED.midrange_accommodation,
        luxury_accommodation = EXCLUDED.luxury_accommodation,
        budget_meal = EXCLUDED.budget_meal,
        midrange_meal = EXCLUDED.midrange_meal,
        fine_dining_meal = EXCLUDED.fine_dining_meal,
        public_transport = EXCLUDED.public_transport,
        taxi_ride = EXCLUDED.taxi_ride,
        car_rental = EXCLUDED.car_rental,
        attraction_ticket = EXCLUDED.attraction_ticket,
        local_tour = EXCLUDED.local_tour,
        seasonal_multipliers = EXCLUDED.seasonal_multipliers,
        last_updated = NOW()
    `);
    
    console.log('✅ Successfully added local currencies:');
    console.log('   Mexico City: MXN (Mexican Peso)');
    console.log('   Patagonia: ARS (Argentine Peso)');
    
  } catch (error) {
    console.error('Error adding local currencies:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addLocalCurrencies();