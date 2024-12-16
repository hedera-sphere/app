"use client";

import { connectWallet, useWallet } from "@/lib/wallet";
import styles from "./page.module.css";
import { useShallow } from "zustand/shallow";

export default function Home() {
  const { walletConnected, accountId } = useWallet(useShallow((s) => ({
    walletConnected: s.walletConnected,
    state: s.state,
    accountId: s.accountId,
    pairingData: s.pairingData
  })))

  const btnConnectWallet = <button onClick={connectWallet}>
    connect wallet
  </button>

  const btnConnected = <div>
    {accountId}
  </div>

  return (
    <div className={styles.page}>


      <div>
        {walletConnected ? btnConnected : btnConnectWallet}
      </div>
    </div>
  );
}
