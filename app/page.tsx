"use client";

import { CryptoSwap } from "@/lib/components/CryptoSwap";
import styles from "./page.module.css";

export default function Home() {

  return (
    <div className={styles.page}>
      <CryptoSwap />
    </div>
  );
}
