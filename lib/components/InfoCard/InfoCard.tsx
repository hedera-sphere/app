import React from 'react';
import Image from 'next/image';
import { ContentCard } from '@/lib/components/ContentCard';
import styles from "./styles.module.scss";

interface InfoCardProps {
  title: string;
  icon: string;
  cards: string[];
}

export const InfoCard = ({ title, icon, cards }: InfoCardProps) => {
  return (
    <ContentCard size={6}>
      <div className={styles.content}>
        <div className={styles.top}>
          <Image src={icon} alt={title} width={75} height={75} />
          <p className={styles.title}>{title}</p>
        </div>
        <div className={styles.bottom}>
          {cards.map((card, index) => (
            <div className={styles.card} key={index}>
              <p>{card}</p>
            </div>
          ))}
        </div>
      </div>
    </ContentCard>

  )
}