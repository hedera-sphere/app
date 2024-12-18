import React from 'react';
import styles from './styles.module.scss';

interface ContentCardProps {
    size?: number;
    mobileSize?: number;
    margins?: boolean;

    className?: string;
    children: React.ReactNode;
}

export const ContentCard = ({ size = 12, mobileSize = 12, margins = true, className, children }: ContentCardProps) => {
  return (
    <div className={`${styles.col} col-${mobileSize} col-md-${size}`}>
        <div className={`${styles.contentCard} ${className}`}>
            <div className={`${styles.container} container ${!margins ? 'px-0 mx-0' : ''}`}>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}
