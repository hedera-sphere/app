"use client";

import { useWallet } from "@/lib/wallet/useWallet";
import { useShallow } from "zustand/shallow";
import { ConnectWalletVerification } from "@/lib/wallet/ConnectWalletVerification";

interface NavConnectWalletProps {
  className?: string;
}

export const NavConnectWallet = ({ className }: NavConnectWalletProps) => {
  const { accountId } = useWallet(useShallow((s) => ({
    accountId: s.accountId,
  })))

  return <ConnectWalletVerification cn={className}>
  <div className={className}>
    {accountId}
  </div>
</ConnectWalletVerification>
}
