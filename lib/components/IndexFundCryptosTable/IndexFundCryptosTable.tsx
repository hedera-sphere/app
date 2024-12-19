"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CryptoData, getSortedCryptoData } from "@/lib/utils/data";
import { ICMCDataResponse, getCMCData } from "@/lib/utils/cmcData";
import { ContentCard } from "@/lib/components/ContentCard";
import styles from "./styles.module.scss";

export const IndexFundCryptosTable = () => {
    const [page, setPage] = useState(0);
    const [cryptosList, setCryptosList] = useState<CryptoData[]>([]);
    const [cmcData, setCMCData] = useState<ICMCDataResponse | null>(null);
    const rowsPerPage = 10;

    const totalPages = Math.ceil((cryptosList?.length || 0) / rowsPerPage);

    const handleFirstPage = () => setPage(0);
    const handlePreviousPage = () => setPage(prev => Math.max(0, prev - 1));
    const handleNextPage = () => setPage(prev => Math.min(totalPages - 1, prev + 1));
    const handleLastPage = () => setPage(totalPages - 1);

     const paginatedCryptos = cryptosList.map(crypto => ({
        ...crypto,
        cmc_id: cmcData?.[crypto.symbol]?.cmc_id || null,
        price: cmcData?.[crypto.symbol]?.price || null,
        change_24h: cmcData?.[crypto.symbol]?.change_24h || null
    })).slice(
        page * rowsPerPage,
        (page + 1) * rowsPerPage
    );

    async function fetchData() {
        const sortedCryptos = await getSortedCryptoData();
        setCryptosList(sortedCryptos);

        const symbols = sortedCryptos.map(crypto => crypto.symbol);
        const cmcData = await getCMCData({ symbols });
        setCMCData(cmcData);
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
                        <div className={styles.cell} title={c.name}>
                            <Image 
                                src={c.cmc_id 
                                    ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${c.cmc_id}.png`
                                    : '/HSPHERE100.svg'} 
                                alt={c.name} 
                                width={64} 
                                height={64} 
                                className={styles.logo} 
                            />
                            {c.name}
                        </div>
                        {/* <div className={styles.cell}>{c.symbol}</div> */}
                        <div className={styles.cell}>{c.weight}%</div>
                        <div className={styles.cell}>
                            ${c.price?.toFixed(2)} USD
                        </div>
                        <div className={styles.cell}>
                            {c.change_24h && (
                                <>
                                    {c.change_24h > 0 ? 
                                        <Image src={'/icons/arrow-up.svg'} alt='Up' width={16} height={16} className={styles.arrow} /> 
                                    : 
                                        <Image src={'/icons/arrow-down.svg'} alt='Down' width={16} height={16} className={styles.arrow} />
                                    }
                                    <span className={c.change_24h > 0 ? styles.green : styles.red}>{Math.abs(c.change_24h).toFixed(2)}%</span>
                                </>
                            )}
                        </div>
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
