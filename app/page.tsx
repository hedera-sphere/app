"use client";

import React, { useEffect, useState } from "react";
import { AppData, CryptoData, getAppData, getHistoricPrices, getSortedCryptoData, HistoricalPrice } from "@/lib/utils/data";
import { CryptoSwap } from "@/lib/components/CryptoSwap";
import { HeroSection } from "@/lib/components/HeroSection";

import styles from "./page.module.scss";

export default function Home() {
  const [cryptosList, setCryptosList] = useState<CryptoData[]>([]);
  const [appData, setAppData] = useState<AppData>({
    hsphereamount: 0,
    lastUpdateTime: 0,
    percentageChange7d: 0,
    tokenPrice: 0
  })
  const [historicPrices, setHistoricPrices] = useState<HistoricalPrice[]>([])
  async function fetchData() {
    async function setSortedCryptosState() {
      const sortedCryptos = await getSortedCryptoData()
      setCryptosList(sortedCryptos);
    }

    async function setAppDataState() {
      const appData = await getAppData()
      setAppData(appData)
    }

    async function setHistoricPricesState() {
      const historicPricesData = await getHistoricPrices()
      setHistoricPrices(historicPricesData)
    }

    setSortedCryptosState()
    setAppDataState()
    setHistoricPricesState()
  }
  console.log("appData", appData)
  console.log("historicPrices", historicPrices)
  useEffect(() => {
    // get all cryptodata items
    fetchData()
  }, [])
  return (
    <div className={styles.page}>
      <HeroSection />
      <CryptoSwap />
      <div>index fund cryptos</div>
      {(cryptosList ?? [])?.map((c) => {
        return <div key={c.symbol}>
          name: {c.name}, symbol: {c.symbol}, portfolio percentage: {c.weight}
        </div>
      })}
    </div>
  );
}
