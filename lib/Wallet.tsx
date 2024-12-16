"use client";

import { useShallow } from "zustand/shallow";
import { connectWallet, useWallet } from "./useWallet";

const Wallet = () => {

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

  return <div>
    {walletConnected ? btnConnected : btnConnectWallet}
  </div>
}

export { Wallet }