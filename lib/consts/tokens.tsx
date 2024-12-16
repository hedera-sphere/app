import HEDERA_DATA from '@/hedera_data.json'

type Token = {
  name: string,
  address: string
}

export const USDT: Token = Object.freeze({
  name: HEDERA_DATA.tokens.usdt.name,
  address: HEDERA_DATA.tokens.usdt.tokenId
})

export const SPHERE: Token = Object.freeze({
  name: HEDERA_DATA.tokens.hsphere.name,
  address: HEDERA_DATA.tokens.hsphere.tokenId
})

export const SPHERE_100: Token = Object.freeze({
  name: HEDERA_DATA.tokens.hsphere100.name,
  address: HEDERA_DATA.tokens.hsphere100.tokenId
})