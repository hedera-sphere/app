import React from 'react';
import styles from './styles.module.scss';

interface SectionProps {
    className?: string;
    children: React.ReactNode;
}

export const Section = ({ children, className }: SectionProps) => {
  return (
    <section className={`${styles.section} ${className}`}>
        <div className={`${styles.container} container`}>
            <div className={`${styles.content} row`}>
                {children}
            </div>
        </div>
    </section>
  )
}
