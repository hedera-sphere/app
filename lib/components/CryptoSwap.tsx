"use client";

import { useState } from "react"
import { CryptoInput, CryptoInputProps } from "./CryptoInput"
import Image from "next/image";
import { SPHERE_100, USDT } from "../consts/tokens";
import { ConnectWalletVerification } from "../wallet/ConnectWalletVerification";
import { getSpherePrice, invest, sellInvestment } from "../utils/transactions";

export const CryptoSwap = () => {
  const [swapStatus, setSwapStatus] = useState<"buy" | "sell">("buy")
  const [usdtAmount, setUsdtAmount] = useState<number>(0);
  const [sphereAmount, setSphereAmount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  async function onChangeCoinAmount(amount: number, tokenName: string) {
    const spherePrice = await getSpherePrice();
    if (tokenName == USDT.name) {
      setUsdtAmount(amount)
      setSphereAmount(amount * spherePrice)
    } else {
      setSphereAmount(amount)
      setUsdtAmount(amount / spherePrice)
    }
  }

  async function onSubmit() {
    if (swapStatus == "buy") {
      try {
        // reset messages
        setErrorMsg("")
        setSuccessMsg("")

        const tokenAmount = await invest(usdtAmount)

        setSuccessMsg(tokenAmount + " HSPHERE100 tokens successfully transfered to your wallet!!!")
        setUsdtAmount(0)
        setSphereAmount(0)
      } catch (e) {
        console.error(e)
        if (e instanceof Error) {
          setErrorMsg(e.message);
        } else {
          setErrorMsg("An unknown error occurred");
        }
      }
    } else {
      try {
        // reset messages
        setErrorMsg("")
        setSuccessMsg("")

        const tokenAmount = await sellInvestment(sphereAmount)

        setSuccessMsg(tokenAmount + " HSPHERE100 tokens successfully transfered to your wallet!!!")
        setUsdtAmount(0)
        setSphereAmount(0)
      } catch (e) {
        console.error(e)
        if (e instanceof Error) {
          setErrorMsg(e.message);
        } else {
          setErrorMsg("An unknown error occurred");
        }
      }
    }
  }
  const USDT_PROPS: CryptoInputProps = {
    // max,
    // maxMessage,
    tokenBalance: 0,
    tokenLogo: <Image src="/usdt.png" alt="usdt" width={25} height={25} />,
    tokenName: USDT.name,
    value: usdtAmount,
    onChange: (amount: number) => onChangeCoinAmount(amount, USDT.name)
  };

  const SPHERE_PROPS: CryptoInputProps = {
    // max,
    // maxMessage,
    tokenBalance: 0,
    tokenLogo: <Image src={"/HSPHERE100.svg"} alt="hsphere" width={25} height={25} />,
    tokenName: SPHERE_100.name,
    value: sphereAmount,
    onChange: (amount: number) => onChangeCoinAmount(amount, SPHERE_100.name)
  }
  const topCoin: CryptoInputProps = swapStatus == "buy" ? USDT_PROPS : SPHERE_PROPS;
  const bottomCoin: CryptoInputProps = swapStatus == "buy" ? SPHERE_PROPS : USDT_PROPS;

  function onSwapClick() {
    setSwapStatus(swapStatus == "buy" ? "sell" : "buy")
  }
  return <div>
    <span>{swapStatus == "buy" ? "Invest" : "Sell"}</span>
    <CryptoInput
      {...topCoin}
    />
    <div onClick={onSwapClick}>
      <Image src="/swap.png" alt="swap" width={20} height={20} />
    </div>
    <CryptoInput
      {...bottomCoin}
    />
    {errorMsg && <span style={{ backgroundColor: 'red' }}>{errorMsg}</span>}
    {successMsg && <span style={{ backgroundColor: 'green' }}>{successMsg}</span>}
    <ConnectWalletVerification>
      <button onClick={onSubmit}>{swapStatus == "buy" ? "Buy Indexed Fund Tokens" : "Sell Indexed Fund Tokens"}</button>
    </ConnectWalletVerification>
  </div>
}