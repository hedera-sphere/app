"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CryptoData, getSortedCryptoData } from "@/lib/utils/data";
import { getTokenData } from "@/lib/utils/tokenData";
import { ContentCard } from "@/lib/components/ContentCard";
import styles from "./styles.module.scss";

export const IndexFundCryptosTable = () => {
    const [tokenData, setTokenData] = useState<any>(null);
    const [page, setPage] = useState(0);
    const [cryptosList, setCryptosList] = useState<CryptoData[]>([]);
    const rowsPerPage = 10;

    const totalPages = Math.ceil((cryptosList?.length || 0) / rowsPerPage);

    const handleFirstPage = () => setPage(0);
    const handlePreviousPage = () => setPage(prev => Math.max(0, prev - 1));
    const handleNextPage = () => setPage(prev => Math.min(totalPages - 1, prev + 1));
    const handleLastPage = () => setPage(totalPages - 1);

    const paginatedCryptos = cryptosList.slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );

    async function fetchData() {
        async function setSortedCryptosState() {
            const sortedCryptos = await getSortedCryptoData();
            setCryptosList(sortedCryptos);
        }

        async function setTokenDataState() {
            const tokenData = await getTokenData({ symbol: 'ETH' });
            setTokenData(tokenData);
        }

        setSortedCryptosState();
        setTokenDataState();
    }

      useEffect(() => {
        fetchData();
      }, []);

  return (
    <ContentCard size={8} margins={false}>
        <div className={styles.table}>
            <div className={styles.head}>
                <div className={`${styles.row}`}>
                    <div className={styles.cell}>Project</div>
                    <div className={styles.cell}>Portafolio percentage</div>
                    <div className={styles.cell}>Token price</div>
                    <div className={styles.cell}>24h price change</div>
                </div>
            </div>
            <div className={styles.body}>
                {(paginatedCryptos ?? [])?.map((c) => {
                    return <div key={c.symbol} className={`${styles.row}`}>
                        <div className={styles.cell}>
                            <Image src={'/HSPHERE100.svg'} alt={c.name} width={24} height={24} className={styles.logo} />
                            {c.name}
                        </div>
                        {/* <div className={styles.cell}>{c.symbol}</div> */}
                        <div className={styles.cell}>{c.weight}%</div>
                    </div>
                })}
            </div>
            <div className={styles.footer}>
                <div className={styles.left}>
                    <button type='button' onClick={handleFirstPage} disabled={page === 0}>
                        First
                    </button>
                    <button title='Previous' type='button' className={styles.withIcon} onClick={handlePreviousPage} disabled={page === 0}>
                        <Image src={'/icons/arrow-left.svg'} alt='Previous' width={16} height={16} />
                    </button>
                </div>
                <div className={styles.center}>
                    <p>Page {page + 1} of {totalPages}</p>
                </div>
                <div className={styles.right}>
                    <button title='Next' type='button' className={styles.withIcon} onClick={handleNextPage} disabled={page === totalPages - 1}>
                        <Image src={'/icons/arrow-right.svg'} alt='Next' width={16} height={16} />
                    </button>
                    <button type='button' onClick={handleLastPage} disabled={page === totalPages - 1}>
                        Last
                    </button>
                </div>
            </div>
        </div>
    </ContentCard>
  )
}
