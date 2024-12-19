"use client";

import { useShallow } from "zustand/shallow";
import { connectWallet, useWallet } from "./useWallet";

type ConnectWalletVerificationProps = {
  children: React.ReactNode
  cn?: string;
}
const ConnectWalletVerification = ({
  children,
  cn
}: ConnectWalletVerificationProps) => {

  const { walletConnected, pairingData } = useWallet(useShallow((s) => ({
    walletConnected: s.walletConnected,
    pairingData: s.pairingData
  })))

  console.log(pairingData)

  const btnConnectWallet = <button type="button" className={cn} onClick={connectWallet}>
    <span>Connect wallet</span>
  </button>

  return <>
    {walletConnected ? children : btnConnectWallet}
  </>
}

export { ConnectWalletVerification }
