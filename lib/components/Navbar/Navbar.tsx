import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavConnectWallet } from '@/lib/wallet/NavConnectWallet';
import { StatusPopup } from '@/lib/components/StatusPopup';
import styles from './styles.module.scss';

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
        <div className={`${styles.container} container`}>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.logo}>
                        <Link href={"/"}>
                            <Image src={"/Hedera-Sphere-Logo.svg"} alt="logo" width={178} height={26} />
                        </Link>
                    </div>
                </div>
                <div className={styles.center}>
                    <div className={styles.navLinks}>
                        <Link href={"/"}>
                            Home
                        </Link>
                        <Link href={"/mint-usdt"}>
                            Mint USDT
                        </Link>
                        <Link href={"/about"}>
                            About
                        </Link>
                        <Link href={"/portafolio"}>
                            Portafolio
                        </Link>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.connectWallet}>
                        <NavConnectWallet />
                    </div>
                </div>
            </div>
        </div>
        <StatusPopup />
    </nav>
  )
}
