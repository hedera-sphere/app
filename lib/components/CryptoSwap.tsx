"use client";

import { useState } from "react"
import { CryptoInput, CryptoInputProps } from "./CryptoInput"
import Image from "next/image";
import { SPHERE_100, USDT } from "../consts/tokens";
import { ConnectWalletVerification } from "../wallet/ConnectWalletVerification";
import { convertTo2Decimals, getSpherePrice, invest, sellInvestment } from "../utils/transactions";
import { AVAILABLE_STATUS, StatusPopupState } from "./StatusPopup";
import { useShallow } from "zustand/shallow";

export const CryptoSwap = () => {
  const [swapStatus, setSwapStatus] = useState<"buy" | "sell">("buy")
  const [usdtAmount, setUsdtAmount] = useState<number>(0);
  const [sphereAmount, setSphereAmount] = useState<number>(0);
  const { setData } = StatusPopupState(useShallow((s) => ({
    setData: s.setData
  })));

  async function onChangeCoinAmount(amount: number, tokenName: string) {
    const spherePrice = await getSpherePrice();
    if (tokenName == USDT.name) {
      setUsdtAmount(amount)
      setSphereAmount(convertTo2Decimals(amount * spherePrice))
    } else {
      setSphereAmount(amount)
      setUsdtAmount(convertTo2Decimals(amount / spherePrice))
    }
  }

  async function onSubmit() {
    try {
      // show modal
      setData({ isVisible: true, status: AVAILABLE_STATUS.LOADING, message: "Please wait... Accept Hashpack transactions" });
      
      if (swapStatus == "buy") {
        const transactionStatus = await invest(usdtAmount)
        const msg = (transactionStatus?.amountReceived ?? 0) + " HSPHERE100 tokens successfully transfered to your wallet with transaction id: " + transactionStatus?.txId;
        setData({ message : msg, status: AVAILABLE_STATUS.SUCCESS });
      } else {
        const transactionStatus = await sellInvestment(sphereAmount)
        const msg = (transactionStatus?.amountReceived ?? 0) + " USDT tokens successfully transfered to your wallet with transaction id: " + transactionStatus?.txId;
        setData({ message : msg, status: AVAILABLE_STATUS.SUCCESS });
      }
      setUsdtAmount(0)
      setSphereAmount(0)
    } catch (e) {
      console.error(e)
      let msg = ""
      if (e instanceof Error) {
        msg = e.message;
      } else {
        msg = "An unknown error occurred"
      }
      setData({ status: AVAILABLE_STATUS.ERROR, message: msg });
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
  if(swapStatus == "buy"){
    USDT_PROPS.tokenBalance = 1000;
    USDT_PROPS.maxMessage = "Balance: 1000 (TEST)"
  }else{
    SPHERE_PROPS.tokenBalance = 2000;
    SPHERE_PROPS.maxMessage = "Balance: 2000 (TEST)"
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
      <button onClick={onSubmit}>{swapStatus == "buy" ? "Buy Indexed Fund Tokens" : "Sell Indexed Fund Tokens"}</button>
    </ConnectWalletVerification>
  </div>
}