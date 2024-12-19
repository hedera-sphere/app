import React from 'react';
import Image from 'next/image';
import { AppData } from '@/lib/utils/data';
import { ContentCard } from '@/lib/components/ContentCard';
import styles from "./styles.module.scss";

interface PriceCardProps {
    appData: AppData;
}

export const PriceCard = ({ appData }: PriceCardProps) => {
    const marketCap = appData.hsphereamount * appData.tokenPrice;
    return (
        <ContentCard size={4}>
            <div className={styles.cards}>
                <div className={styles.card}>
                    <p className={styles.title}>7d price change</p>
                    <div className={styles.iconText}>
                        {appData.percentageChange7d > 0 ?
                            <Image src={'/icons/arrow-up.svg'} alt='Up' width={16} height={16} className={styles.arrow} />
                        :
                            <Image src={'/icons/arrow-down.svg'} alt='Down' width={16} height={16} className={styles.arrow} />
                        }
                        <p className={styles.value + ' ' + (appData.percentageChange7d > 0 ? styles.green : styles.red)}>{Math.abs(appData.percentageChange7d).toFixed(2)}%</p>
                    </div>
            
                </div>
                <div className={styles.card}>
                    <p className={styles.title}>Fund market cap</p>
                    <p className={styles.value}>${marketCap.toFixed(2)}</p>
                </div>
            </div>
        </ContentCard>
    )
}