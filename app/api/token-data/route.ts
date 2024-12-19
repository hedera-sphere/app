import { NextResponse } from 'next/server';
import { coinMarketCapApi } from '@/lib/utils/axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
        return NextResponse.json(
            { error: 'Symbol parameter is required' },
            { status: 400 }
        );
    }

    try {
        const response = await coinMarketCapApi.get(`/cryptocurrency/quotes/latest?symbol=${symbol}`);
        console.log(response);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch token data' },
            { status: 500 }
        );
    }
}
