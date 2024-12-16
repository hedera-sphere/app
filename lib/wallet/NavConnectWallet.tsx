"use client";

import { useWallet } from "@/lib/wallet/useWallet";
import { useShallow } from "zustand/shallow";
import { ConnectWalletVerification } from "@/lib/wallet/ConnectWalletVerification";

export const NavConnectWallet = () => {
  const { accountId } = useWallet(useShallow((s) => ({
    accountId: s.accountId,
  })))

  return <ConnectWalletVerification>
  <div>
    {accountId}
  </div>
</ConnectWalletVerification>
}