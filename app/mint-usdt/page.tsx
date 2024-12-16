"use client";

import { CryptoInput } from "@/lib/components/CryptoInput";
import { checkTokenSupport, mintUsdt } from "@/lib/utils/transactions";
import { ConnectWalletVerification } from "@/lib/wallet/ConnectWalletVerification";
import { useState } from "react";
const MAX_MINT = 10000;
export default function Home() {
  const [value, setValue] = useState<number>(0);
  async function onSubmit() {
    console.log("minting tokens", value)
    const tokenSuport = await checkTokenSupport()
    console.log("tokenSuport: ", tokenSuport)
    mintUsdt(value)
  }
  return (
    <div>
      <span>Mint usdt to test our project :)</span>
      <CryptoInput
        max={MAX_MINT}
        maxMessage={`${MAX_MINT} maxium`}
        tokenLogo={<></>}
        initialValue={value}
        onChange={setValue}
        tokenName=""
      />
      <ConnectWalletVerification>
        <button onClick={onSubmit}>Mint</button>
      </ConnectWalletVerification>
    </div>
  );
}
