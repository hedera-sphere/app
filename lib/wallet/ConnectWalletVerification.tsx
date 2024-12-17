"use client";

import { useShallow } from "zustand/shallow";
import { connectWallet, useWallet } from "./useWallet";
import Image from "next/image";

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

  const btnConnectWallet = <div onClick={connectWallet}>
    <span>Connect wallet</span>
    <Image src="/hashpack.png" alt="hashpack" width={25} height={25} />
  </div>

  return <div>
    {walletConnected ? children : btnConnectWallet}
  </div>
}

export { ConnectWalletVerification }