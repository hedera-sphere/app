"use client";

import { CryptoInput } from "@/lib/components/CryptoInput";
import { checkTokenSupport, mintUsdt } from "@/lib/utils/transactions";
import { ConnectWalletVerification } from "@/lib/wallet/ConnectWalletVerification";
import { useState } from "react";
const MAX_MINT = 10000;
export default function Home() {
  const [amount, setAmount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  async function onSubmit() {
    console.log("minting tokens", amount)
    setErrorMsg("")
    setSuccessMsg("")
    const tokenSuport = await checkTokenSupport()
    if (!tokenSuport) {
      setErrorMsg("You must accept associate token transaction")
      return
    }
    console.log("tokenSuport: ", tokenSuport)
    const mintSuccess = mintUsdt(amount)
    if (!mintSuccess) {
      setErrorMsg("Error minting tokens")
    }else{
      setSuccessMsg("Tokens minted successfully!!!")
    }
  }

  return (
    <div>
      <span>Mint usdt to test our project :)</span>
      {errorMsg && <span style={{ backgroundColor: 'red' }}>{errorMsg}</span>}
      {successMsg && <span style={{ backgroundColor: 'green' }}>{successMsg}</span>}
      <CryptoInput
        max={MAX_MINT}
        maxMessage={`${MAX_MINT} maxium`}
        tokenLogo={<></>}
        initialValue={amount}
        onChange={setAmount}
        tokenName=""
      />
      <ConnectWalletVerification>
        <button onClick={onSubmit}>Mint</button>
      </ConnectWalletVerification>
    </div>
  );
}
