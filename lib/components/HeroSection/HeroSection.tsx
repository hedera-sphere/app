import React from 'react';
import styles from "./styles.module.scss";

export const HeroSection = () => {
  return (
    <header className={styles.heroSection}>
      <div className={`${styles.container} container`}>
        <div className={styles.content}>
          <h1>The first blockchain fund based on Hedera</h1>
          <p>Hedera Sphere allows you to easily, invest and manage your portfolio in the top protocols in the ecosystem</p>
          <div className={styles.buttons}>
            <button>Connect Wallet</button>
            <button>Learn More</button>
          </div>
        </div>
      </div>
    </header>
  )
}
