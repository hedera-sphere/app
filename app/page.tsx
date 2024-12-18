"use client";

import { CryptoSwap } from "@/lib/components/CryptoSwap";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { CryptoData } from "@/lib/utils/data";

export default function Home() {
  const [cryptosList, setCryptosList] = useState<CryptoData[]>([]);
  async function getSortedCryptoData(): Promise<CryptoData[]> {
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
  async function fetchCryptoData(){
    const data = await getSortedCryptoData()
    setCryptosList(data);
  }
  useEffect(()=>{
    // get all cryptodata items
    fetchCryptoData()
  },[])
  return (
    <div className={styles.page}>
      <CryptoSwap />
      <div>index fund cryptos</div>
      {(cryptosList ?? [])?.map((c)=>{
        return <div key={c.symbol}>
          name: {c.name}, symbol: {c.symbol}, portfolio percentage: {c.weight}
          </div>
      })}
    </div>
  );
}
