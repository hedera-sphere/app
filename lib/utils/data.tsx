import { supabaseBrowser } from "@/lib/supabase/client";

export type CryptoData = {
  name: string,
  symbol: string,
  weight: string
}

export type AppData = {
  percentageChange7d: number;
  tokenPrice: number
  lastUpdateTime: number // timestamp
  hsphereamount: number
}

export type HistoricalPrice = {
  date: number,
  tokenPrice: number
}
export async function getCryptos(): Promise<CryptoData[]> {
  return []
}

export async function getSortedCryptoData(): Promise<CryptoData[]> {
  try {
    const { data, error } = await supabaseBrowser
      .from('cryptodata')
      .select('symbol, name, weight') // Get all columns
      .order('weight', { ascending: false }); // Sort by 'weight' in descending order

    if (error) {
      console.error('Error fetching sorted cryptodata:', error);
    } else {
      console.log('Fetched and sorted cryptodata:', data);
      return data;
    }
  } catch (error) {
    console.error('Error in getSortedCryptoData:', error);
  }
  return []
}
export async function getAppData(): Promise<AppData> {
  try {
    const { data, error } = await supabaseBrowser
      .from('appdata')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Error fetching sorted appdata:', error);
    } else {
      console.log('Fetched and sorted appdata:', data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data as any as AppData;
    }
  } catch (error) {
    console.error('Error in getSortedappdata:', error);
  }
  return {
    hsphereamount: 0,
    lastUpdateTime: 0,
    percentageChange7d: 0,
    tokenPrice: 0
  }
}

export async function getHistoricPrices(): Promise<HistoricalPrice[]>{
  try {
    const { data, error } = await supabaseBrowser
      .from('historicprice')
      .select('*') // Get all columns
      // .order('date', { ascending: false }); // Sort by 'weight' in descending order

    if (error) {
      console.error('Error fetching sorted historic prices:', error);
    } else {
      console.log('Fetched and sorted historic prices:', data);
      return data;
    }
  } catch (error) {
    console.error('Error in getSortedHistoric prices:', error);
  }
  return []
}

export async function increaseHsphereAmount(amount: number) {
  try {
    const appData = await getAppData()
    const totalAmount = appData.hsphereamount + amount
    console.log(appData)
    console.log("amount", amount)
    console.log("====", appData.hsphereamount)
    console.log("totalAmount", totalAmount)
    const data = {
      id: 1, // The record ID you are updating
      hsphereamount: totalAmount
    }
    await supabaseBrowser
      .from('appdata')
      .upsert([data], { onConflict: 'id' }) // Ensure conflict resolution happens only on the 'id' column
      
  } catch (e) {
    console.log("Failed to increase hsphere", e)
  }
}

export async function decreaseHsphereAmount(amount: number) {
  try {
    const appData = await getAppData()
    const totalAmount = appData.hsphereamount - amount
    const data = {
      id: 1, // The record ID you are updating
      hsphereamount: totalAmount
    }
    await supabaseBrowser
      .from('appdata')
      .upsert([data], { onConflict: 'id' }) // Ensure conflict resolution happens only on the 'id' column
      
  } catch (e) {
    console.log("Failed to increase hsphere", e)
  }
}