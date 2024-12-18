import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

// Environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""; // Server-side only

const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)

async function upsertAppData(dataToUpsert) {
  const { data, error } = await supabaseServer
    .from('appdata')
    .upsert(dataToUpsert, { onConflict: ['id'] }); // Use 'id' as the conflict target

  if (error) {
    console.error('Error upserting data:', error);
  } else {
    console.log('Upsert successful. Data:', data);
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
      console.log(response)
      throw new Error('Failed to fetch data');
    }

    const data = await response.data;
    console.log(data)
    console.log("=========== data above ==========")

    const mostRecentValue = getMostRecentData(data);
    console.log("Most Recent Value:", mostRecentValue);

    const difference = calculateDifference(data);
    console.log("Difference between Latest and Oldest:", difference);

    const appData = {
      id: 1,
      lastUpdateTime: new Date(),
      tokenPrice: mostRecentValue.value,
      percentageChange7d: difference
    }

    await upsertAppData(appData)
  } catch (error) {
    console.log(error)
    return {
      data: [],
      status: {}
    }
  }
}


console.log("start fetching")
await fetchIndexData();
console.log("end fetching")


