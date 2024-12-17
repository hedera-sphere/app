"use client";

import { useState } from "react"
import { CryptoInput, CryptoInputProps } from "./CryptoInput"
import Image from "next/image";
import { SPHERE_100, USDT } from "../consts/tokens";
import { ConnectWalletVerification } from "../wallet/ConnectWalletVerification";

export const CryptoSwap = () => {
  const [swapStatus, setSwapStatus] = useState<"buy" | "sell">("buy")
  const [usdtAmount, setUsdtAmount] = useState<number>(0);
  const [sphereAmount, setSphereAmount] = useState<number>(0);

  function onChangeCoinAmount(amount: number, tokenName: string) {

    if (tokenName == USDT.name) {
      setUsdtAmount(amount)
    } else {
      setSphereAmount(amount)
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
    <ConnectWalletVerification>
      <button>{swapStatus == "buy" ? "Buy Indexed Fund Tokens" : "Sell Indexed Fund Tokens"}</button>
    </ConnectWalletVerification>
  </div>
}