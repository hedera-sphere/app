export type CryptoData = {
  name: string,
  symbol: string,
  weight: string
}

export type AppData = {
  percentageChange7d: number;
  tokenPrice: number
  lastUpdateTime: number // timestamp
  hsphereamount: number
}

export type HistoricalPrice = {
  date: number,
  tokenPrice: number
}
export async function getCryptos(): Promise<CryptoData[]> {
  return []
}

export async function getAppData(): Promise<AppData> {
  return {
    percentageChange7d: 7.7,
    tokenPrice: 1.5,
    lastUpdateTime: 9232332,
    hsphereamount: 1
  }
}
