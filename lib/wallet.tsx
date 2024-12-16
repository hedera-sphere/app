import { LedgerId } from "@hashgraph/sdk";
import { DappMetadata, HashConnect, HashConnectConnectionState, SessionData } from "hashconnect";
import { create } from "zustand";
interface WalletData {
  walletConnected: boolean,
  accountId: string | null,
  state: HashConnectConnectionState,
  pairingData: SessionData | null,
  updateState: (newState: Partial<WalletData>) => void
}

export const useWallet = create<WalletData>((set) => ({
  walletConnected: false,
  accountId: null,
  state: HashConnectConnectionState.Disconnected,
  pairingData: null,
  updateState: (newState: Partial<WalletData>) => set((oldState: WalletData) => {
    const state = {
      ...oldState,
      ...newState
    }
    const accounts = state?.pairingData?.accountIds ?? []
    const walletConnected = accounts?.length > 0
    const accountId = accounts?.[0] ?? null
    return {
      ...state,
      walletConnected,
      accountId
    }
  }),
}));

const appMetaData: DappMetadata = {
  name: "Hedera Sphere",
  description: "Hedera Sphere Index Fund",
  icons: [],
  url: "https://hedera.com/"
  // icon: ""
};
// const hashConnect = new HashConnect(appMetaData, "testnet", false);
let hashconnect: HashConnect;

export async function connectWallet() {
  hashconnect = new HashConnect(LedgerId.TESTNET, "fdb642f05db3cbb2c4a547af58fd4143", appMetaData);

  setUpHashConnectEvents()

  await hashconnect.init()

  const status = useWallet.getState()
  if (!status.walletConnected && !status.accountId) {
    hashconnect.openPairingModal();
  }
}

async function setUpHashConnectEvents() {
  hashconnect.pairingEvent.once((pairingData) => {
    const updateState = useWallet.getState().updateState;
    updateState({
      pairingData
    })
  })

  hashconnect.disconnectionEvent.on(() => {
    const updateState = useWallet.getState().updateState;
    updateState({
      pairingData: null
    })
  });

  hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
    const updateState = useWallet.getState().updateState;
    updateState({
      state: connectionStatus
    })
  })

}