import React from 'react';
import styles from "./styles.module.scss";
import Image from 'next/image';

export const PriceCard = () => {
    return (
        <div className={styles.cards}>
            <div className={styles.card}>
                <p className={styles.title}>7d price change</p>
                <div className={styles.iconText}>
                    <Image src={'/icons/arrow-up.svg'} alt='Up' width={16} height={16} className={styles.arrow} /> 
                    <p className={styles.value + ' ' + styles.green}>5.20%</p>
                </div>
                
            </div>
            <div className={styles.card}>
                <p className={styles.title}>Fund market cap</p>
                <p className={styles.value}>$122,3412</p>
            </div>
            <div className={styles.card}>
                <p className={styles.title}>Number of users</p>
                <p className={styles.value}>12,542</p>
            </div>
        </div>
    )
}