"use client";

import { CryptoInput } from "@/lib/components/CryptoSwap/CryptoInput";
import { AVAILABLE_STATUS, StatusPopupState } from "@/lib/components/StatusPopup";
import {  mintUsdt } from "@/lib/utils/transactions";
import { ConnectWalletVerification } from "@/lib/wallet/ConnectWalletVerification";
import Image from "next/image";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
const MAX_MINT = 10000;
export default function Home() {
  const [amount, setAmount] = useState<number>(0);
  const { setData } = StatusPopupState(useShallow((s) => ({
    setData: s.setData
  })));
  async function onSubmit() {
    try {
      // show modal
      setData({ isVisible: true, status: AVAILABLE_STATUS.LOADING, message: "Please wait... Accept Hashpack transactions" });

      // mint usdt and send to user
      await mintUsdt(amount)
      setData({ message: amount + " USDT tokens successfully transfered to your wallet!!!", status: AVAILABLE_STATUS.SUCCESS });
      setAmount(0)
    } catch (e) {
      console.error(e)
      let msg = ""
      if (e instanceof Error) {
        msg = e.message;
      } else {
        msg = "An unknown error occurred"
      }
      setData({ status: AVAILABLE_STATUS.LOADING, message: msg });
    }

  }

  return (
    <div>
      <span>Mint usdt to test our project :)</span>
      <CryptoInput
        max={MAX_MINT}
        maxMessage={`${MAX_MINT} maxium`}
        tokenLogo={<Image src="/usdt.png" alt="usdt" width={25} height={25} />}
        value={amount}
        onChange={(v: number) => setAmount(v)}
        tokenName=""
      />
      <ConnectWalletVerification>
        <button onClick={onSubmit}>Mint</button>
      </ConnectWalletVerification>
    </div>
  );
}
