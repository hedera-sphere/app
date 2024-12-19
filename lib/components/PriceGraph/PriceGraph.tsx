import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ContentCard } from '@/lib/components/ContentCard';
import styles from './styles.module.scss';

interface IData {
    date: string;
    price: number;
}

export const PriceGraph = ({data}: {data: IData[]}) => {
    const minPrice = Math.min(...data.map(item => item.price));
    const maxPrice = Math.max(...data.map(item => item.price));

  return (
    <ContentCard size={8}>
        <div className={styles.priceGraph}>
            Graph

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis dataKey="date" strokeOpacity={0} />
                    <YAxis orientation='right' domain={[Math.floor(minPrice * 0.95), Math.ceil(maxPrice * 1.05)]} strokeOpacity={0} />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Area type="monotone" dataKey="price" stroke="#191919" fill="#BC2095" fillOpacity={0.14} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </ContentCard>
  )
}
