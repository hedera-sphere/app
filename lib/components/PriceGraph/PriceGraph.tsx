import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalPrice, AppData } from '@/lib/utils/data';
import { ContentCard } from '@/lib/components/ContentCard';
import styles from './styles.module.scss';

interface IProps {
    name: string;
    appData: AppData;
    historicPrices: HistoricalPrice[];
}

enum RANGES {
    SEVEN_DAYS = 7,
    THIRTY_DAYS = 30,
    ALL = 'All'
}

export const PriceGraph = ({name, appData, historicPrices}: IProps) => {
    const [range, setRange] = useState<RANGES>(RANGES.SEVEN_DAYS);

    const minPrice = Math.min(...historicPrices.map(item => item.tokenPrice));
    const maxPrice = Math.max(...historicPrices.map(item => item.tokenPrice));

    const filteredPrices = historicPrices
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .filter(item => {
            const date = new Date(item.date);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return range === RANGES.ALL || diffDays <= range;
        });

  return (
    <ContentCard size={8}>
        <div className={styles.priceGraph}>
            <div className={styles.header}>
                <div className={styles.name}>
                    <p>{name} Price</p>
                </div>
                <div className={styles.range}>
                    <button onClick={() => setRange(RANGES.SEVEN_DAYS)} className={range === RANGES.SEVEN_DAYS ? styles.active : ''}>7D</button>
                    <button onClick={() => setRange(RANGES.THIRTY_DAYS)} className={range === RANGES.THIRTY_DAYS ? styles.active : ''}>30D</button>
                    <button onClick={() => setRange(RANGES.ALL)} className={range === RANGES.ALL ? styles.active : ''}>All</button>
                </div>
            </div>

            <div className={styles.price}>
                <div className={styles.priceValue}>
                    <p>${appData.tokenPrice.toFixed(2)}</p>
                </div>
                <div className={styles.priceChange}>
                    <p className={appData.percentageChange7d > 0 ? styles.green : styles.red}>
                        {appData.percentageChange7d > 0 ? '+' : '-'}{appData.percentageChange7d.toFixed(2)}% / 7d
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={filteredPrices}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 5
                    }}
                >
                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`; 
                        }}
                        strokeOpacity={0}
                        tickMargin={16}
                    />
                    <YAxis
                        orientation='right'
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                        domain={[Math.floor(minPrice * 0.95), Math.ceil(maxPrice * 1.05)]}
                        strokeOpacity={0}
                        tickMargin={16}
                    />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#191919" fill="#BC2095" fillOpacity={0.14} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </ContentCard>
  )
}
