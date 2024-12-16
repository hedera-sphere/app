"use client";

import { useShallow } from "zustand/shallow";
import { connectWallet, useWallet } from "./useWallet";

type ConnectWalletVerificationProps = {
  children: React.ReactNode
}
const ConnectWalletVerification = ({
  children
}: ConnectWalletVerificationProps) => {

  const { walletConnected, pairingData } = useWallet(useShallow((s) => ({
    walletConnected: s.walletConnected,
    pairingData: s.pairingData
  })))

  console.log(pairingData)

  const btnConnectWallet = <button onClick={connectWallet}>
    Connect wallet
  </button>

  return <div>
    {walletConnected ? children : btnConnectWallet}
  </div>
}

export { ConnectWalletVerification }