import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Wallet } from "@/lib/Wallet";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav>
          <div>
            <Link href={"/"}>
              Home
            </Link>
          </div>
          <div>
            <Link href={"/about"}>
              About
            </Link>
          </div>
          <div>
            <Link href={"/mint-usdt"}>
              Mint Usdt
            </Link>
          </div>
          <Wallet />
        </nav>
        {children}
      </body>
    </html>
  );
}
