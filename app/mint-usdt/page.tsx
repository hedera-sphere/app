"use client";

import { CryptoInput } from "@/lib/components/CryptoInput";
import { useState } from "react";
const MAX_MINT = 10000;
export default function Home() {
  const [value, setValue] = useState<number>(0);
  function onSubmit (){
    console.log("minting tokens", value)
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
      <button onClick={onSubmit}>Mint</button>
    </div>
  );
}
