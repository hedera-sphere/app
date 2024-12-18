import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();
const EXECUTION_INTERVAL_MINUTES = 60;
const DIFERENCE_BETWEEN_DATA_UPSERT = 1
const REMOVE_CRYPTO_DATA_AT_DAYS = 1;
// Environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""; // Server-side only

const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)

async function upsertAppData(rawData) {
  try {
    const mostRecentValue = getMostRecentData(rawData);
    console.log("Most Recent Value:", mostRecentValue.value);

    const difference = calculateDifference(rawData);
    console.log("Difference between Latest and Oldest:", difference);

    const dataToUpsert = {
      id: 1,
      lastUpdateTime: new Date(),
      tokenPrice: mostRecentValue.value,
      percentageChange7d: difference
    }
    // Fetch the existing row with the same id
    const { data: existingData, error: fetchError } = await supabaseServer
      .from('appdata')
      .select('lastUpdateTime')
      .eq('id', dataToUpsert.id)
      .single(); // Fetch a single row (assuming `id` is unique)

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        // If the row does not exist, proceed with the upsert
        console.log('No existing data found. Proceeding with upsert...');
      } else {
        throw new Error(`Error fetching existing data: ${fetchError.message}`);
      }
    }

    // Check if the lastUpdateTime is more than 1 hour newer
    if (existingData) {
      const existingTime = new Date(existingData.lastUpdateTime);
      const newTime = new Date(dataToUpsert.lastUpdateTime);
      const timeDifferenceInMins = (newTime - existingTime) / (1000 * 60 * DIFERENCE_BETWEEN_DATA_UPSERT); // Time difference in mins

      if (timeDifferenceInMins <= 1) {
        console.log('Upsert skipped: lastUpdateTime is not more than 1 minute newer.');
        return;
      }else{
        console.log("Upsert appdata executed")
      }
    }

    // Proceed with upsert if no conflict or valid time difference
    const { data, error } = await supabaseServer
      .from('appdata')
      .upsert(dataToUpsert, { onConflict: ['id'] }); // Use 'id' as the conflict target

    if (error) {
      console.error('Error upserting data:', error);
    } else {
      console.log('Upsert successful. Data:', data);
    }

    console.log("Upserting crypto data")
    for(let crypto of (mostRecentValue.constituents ?? [])){
      upsertCryptoData(crypto)
    }
    await upsertHistoricPrice(mostRecentValue.update_time, mostRecentValue.value)
    await removeOldCryptoData()
    console.log("Finished usperting crypto data")
  } catch (error) {
    console.error('Error in upsertAppData:', error.message);
  }
}

async function upsertCryptoData(cryptoData) {
  const dataToUpsert = {
    symbol: cryptoData.symbol,
    name: cryptoData.name,
    weight: cryptoData.weight,
    created_at: new Date().toISOString(), // Use current timestamp
  };
  console.log("data to insert", dataToUpsert)

  try {
    const { data, error } = await supabaseServer
      .from('cryptodata')
      .upsert(dataToUpsert, { onConflict: ['symbol'] }); // Use 'symbol' as the conflict target

    if (error) {
      console.error('Error upserting cryptodata:', error);
    } else {
      console.log(`Upsert successful id. ${dataToUpsert.symbol} Data:`, data);
    }
  } catch (error) {
    console.error('Error in upsertCryptoData:', error.message);
  }
}

async function upsertHistoricPrice(date, price) {
  const dataToUpsert = {
    date,
    price,
  };

  try {
    const { data, error } = await supabaseServer
      .from('historicprice')
      .upsert(dataToUpsert, { onConflict: ['date'] }); // Use 'date' as the conflict target

    if (error) {
      console.error('Error upserting historic price:', error);
    } else {
      console.log(`Upsert successful historic price. ${dataToUpsert.date} Data:`, data);
    }
  } catch (error) {
    console.error('Error in upsert historic price:', error.message);
  }
}

async function removeOldCryptoData() {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - REMOVE_CRYPTO_DATA_AT_DAYS); // Subtract 1 day
  const oneDayAgoISO = oneDayAgo.toISOString();

  try {
    const { data, error } = await supabaseServer
      .from('cryptodata')
      .delete()
      .lt('created_at', oneDayAgoISO); // Delete where created_at is less than one day ago

    if (error) {
      console.error('Error deleting old cryptodata:', error);
    } else {
      console.log('Deleted old cryptodata. Rows affected:', data?.length ?? null);
    }
  } catch (error) {
    console.error('Error in removeOldCryptoData:', error.message);
  }
}

function getMostRecentData(data) {
  if (!data?.data?.length) {
    throw new Error("Data is empty or invalid.");
  }

  const mostRecent = data.data.reduce((latest, current) => {
    return new Date(current.update_time) > new Date(latest.update_time) ? current : latest;
  });

  return mostRecent;
}

function calculateDifference(data) {
  if (!data?.data?.length) {
    throw new Error("Data is empty or invalid.");
  }

  // Sort data by update_time
  const sortedData = [...data.data].sort(
    (a, b) => new Date(a.update_time) - new Date(b.update_time)
  );

  const oldest = sortedData[0].value;
  const latest = sortedData[sortedData.length - 1].value;

  return latest - oldest;
}


async function fetchIndexData() {
  try {
    const response = await axios('https://pro-api.coinmarketcap.com/v3/index/cmc100-historical?count=7', {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_API ?? ""
      }
    })

    if (response.status != 200) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.data;

    await upsertAppData(data)
  } catch (error) {
    console.log(error)
    return {
      data: [],
      status: {}
    }
  }
}


async function startFetching() {
  while (true) {
    try {
      const executedAt = new Date().toISOString();
      console.log(`Start fetching at: ${executedAt}`);
      
      await fetchIndexData(); // Your function to fetch data
      
      console.log(`End fetching at: ${new Date().toISOString()}`);
    } catch (error) {
      console.error("Error in fetch loop:", error.message);
    }

    // Wait for 5 minutes before running again
    await new Promise(resolve => setTimeout(resolve, EXECUTION_INTERVAL_MINUTES * 60 * 1000)); // 5 minutes
  }
}

// Start the loop
startFetching();