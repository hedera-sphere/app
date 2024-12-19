"use client";

import React, { useEffect, useState } from "react";
import { AppData, getAppData, getHistoricPrices, HistoricalPrice } from "@/lib/utils/data";
import { CryptoSwap } from "@/lib/components/CryptoSwap";
import { HeroSection } from "@/lib/components/HeroSection";
import { IndexFundCryptosTable } from "@/lib/components/IndexFundCryptosTable";
import { PriceGraph } from "@/lib/components/PriceGraph";
import { InfoCard } from "@/lib/components/InfoCard";
import { Section } from "@/lib/components/Section";
import { ContentCard } from "@/lib/components/ContentCard";
import { PriceCard } from "@/lib/components/PriceCard";

import styles from "./page.module.scss";

export default function Home() {
  const [appData, setAppData] = useState<AppData>({
    hsphereamount: 0,
    lastUpdateTime: 0,
    percentageChange7d: 0,
    tokenPrice: 0
  })
  const [historicPrices, setHistoricPrices] = useState<HistoricalPrice[]>([])
  async function fetchData() {
    async function setAppDataState() {
      const appData = await getAppData()
      setAppData(appData)
    }

    async function setHistoricPricesState() {
      const historicPricesData = await getHistoricPrices()
      setHistoricPrices(historicPricesData)
    }

    setAppDataState()
    setHistoricPricesState()
  }
  console.log("appData", appData)
  console.log("historicPrices", historicPrices)
  useEffect(() => {
    // get all cryptodata items
    fetchData()
  },[]);
  return (
    <main className={styles.page}>
      <HeroSection />
      <Section>
        <IndexFundCryptosTable />
        <CryptoSwap />
        <PriceGraph name={'HSPHERE'} appData={appData} historicPrices={historicPrices} />
        <ContentCard size={4}>
          <PriceCard />
        </ContentCard>
        <InfoCard
          title="HSPHERE"
          icon="/HSPHERE.svg"
          cards={["Governance token for decision-making", "Earns USDT generated from index token fees", "Exclude unuseful tokens for an index (USDT, etc)"]}
        />
        <InfoCard
          title="HSPHERE100"
          icon="/HSPHERE100.svg"
          cards={["Automatic Portfolio Diversification", "Automatic Fund Rebalancing", "Access to New Investment Opportunities"]}
        />
      </Section>
    </main>
  );
}
