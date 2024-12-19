'use server';

import axios from 'axios';

interface ITokenData {
    symbol: string;
}

interface ITokenDataResponse {
    cmc_id: number;
    name: string;
    symbol: string;
    price: number;
    change_24h: number;
}

export const getTokenData = async ({ symbol }: ITokenData): Promise<ITokenDataResponse | null> => {
    try {
        const res = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`, {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
            },
            timeout: 15000
        });

        const data = await res.data;
        const tokenData = data.data[symbol];
        return {
            cmc_id: tokenData.id,
            name: tokenData.name,
            symbol: tokenData.symbol,
            price: tokenData.quote.USD.price,
            change_24h: tokenData.quote.USD.percent_change_24h
        };
    } catch (error) {
        console.error('Failed to fetch token data:', error);
        return null;
    }
}
