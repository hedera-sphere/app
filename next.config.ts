import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // transpilePackages: ['hashconnect','@hashgraph/sdk','@hashgraph/hedera-wallet-connect'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        pathname: '/static/img/coins/**',
      },
    ],
  },
};

export default nextConfig;
