import React from 'react';
import styles from "./styles.module.scss";
import Image from 'next/image';


export const HsphereInfo = () => {
  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <Image src="/HSPHERE.svg" alt="Hsphere" width={75} height={75} />
        <p className={styles.title}>HSPHERE</p>
      </div>
      <div className={styles.bottom}>
        <div className={styles.card}>
          <p>Governance token for decision-making</p>
        </div>
        <div className={styles.card}>
          <p>Earns USDT generated from index token fees</p>
        </div>
        <div className={styles.card}>
          <p>Exclude unuseful tokens for an index (USDT, etc)</p>
        </div>
      </div>
    </div>

  )
}