import React from 'react';
import styles from "./styles.module.scss";

export const HeroSection = () => {
  return (
    <header className={styles.heroSection}>
      <div className={`${styles.container} container`}>
        <div className={styles.content}>
          <h1>HeroSection</h1>
        </div>
      </div>
    </header>
  )
}
