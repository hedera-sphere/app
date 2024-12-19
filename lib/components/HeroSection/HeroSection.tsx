import React from 'react';
import styles from "./styles.module.scss";

export const HeroSection = () => {
  return (
    <header className={styles.heroSection}>
      <div className={`${styles.container} container`}>
        <div className={styles.content}>
          <h1 className={styles.title}>The first blockchain fund based on Hedera</h1>
          <p className={styles.description}>Hedera Sphere allows you to easily invest in the top protocols in the Web3 ecosystem</p>
          <div className={styles.buttons}>
            <button className={styles.btnType2}>Connect Wallet</button>
          </div>
        </div>
      </div>
    </header>
  )
}
