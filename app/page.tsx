"use client";

import React, { useEffect, useState } from "react";
import { AppData, CryptoData, getAppData, getSortedCryptoData } from "@/lib/utils/data";
import { CryptoSwap } from "@/lib/components/CryptoSwap/CryptoSwap";
import { HeroSection } from "@/lib/components/HeroSection";
import { Section } from "@/lib/components/Section";
import { ContentCard } from "@/lib/components/ContentCard";

import styles from "./page.module.scss";

export default function Home() {
  const [cryptosList, setCryptosList] = useState<CryptoData[]>([]);
  const [appData, setAppData] = useState<AppData>({
    hsphereamount: 0,
    lastUpdateTime: 0,
    percentageChange7d: 0,
    tokenPrice: 0
  })
 
  async function fetchData(){
    const sortedCryptos = await getSortedCryptoData()
    setCryptosList(sortedCryptos);
    const appData = await getAppData()
    setAppData(appData)
  }
  console.log("appData", appData)
  useEffect(()=>{
    // get all cryptodata items
    fetchData()
  },[]);

  return (
    <main className={styles.page}>
      <HeroSection />
      <Section>
        <ContentCard size={8}>
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
          Table
          <br />
        </ContentCard>
        <ContentCard size={4}>
            <CryptoSwap />
        </ContentCard>
        <ContentCard size={8}>
            Graph
          </ContentCard>
          <ContentCard size={4}>
            Price?
          </ContentCard>
          <ContentCard size={6}>
            Chart 1
          </ContentCard>
          <ContentCard size={6}>
            Chart 2
          </ContentCard>
      </Section>

        
      <div>index fund cryptos</div>
      {(cryptosList ?? [])?.map((c)=>{
        return <div key={c.symbol}>
          name: {c.name}, symbol: {c.symbol}, portfolio percentage: {c.weight}
          </div>
      })}
    </main>
  );
}
