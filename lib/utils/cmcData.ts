'use server';

import axios from 'axios';

export interface ICMCData {
    symbols: string[];
}

export interface ICMCDataResponse {
    [key: string]: {
        cmc_id: number;
        name: string;
        symbol: string;
        price: number;
        change_24h: number;
    }
}

export const getCMCData = async ({ symbols }: ICMCData): Promise<ICMCDataResponse | null> => {
    try {
        const res = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols.join(',')}`, {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
            },
            timeout: 15000
        });

        const data = await res.data;
        const cmcData: ICMCDataResponse = {};
        symbols.forEach(symbol => {
            const tokenInfo = data.data[symbol][0];
            cmcData[symbol] = {
                cmc_id: tokenInfo.id,
                name: tokenInfo.name,
                symbol: tokenInfo.symbol,
                price: tokenInfo.quote.USD.price,
                change_24h: tokenInfo.quote.USD.percent_change_24h
            };
        });
        return cmcData;
    } catch (error) {
        console.error('Failed to fetch token data:', error);
        return null;
    }
}
