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

    if (error) {
      console.error('Error fetching sorted cryptodata:', error);
    } else {
      console.log('Fetched and sorted cryptodata:', data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data as any as AppData;
    }
  } catch (error) {
    console.error('Error in getSortedCryptoData:', error);
  }
  return {
    hsphereamount: 0,
    lastUpdateTime: 0,
    percentageChange7d: 0,
    tokenPrice: 0
  }
}
