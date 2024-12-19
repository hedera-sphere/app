import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // transpilePackages: ['hashconnect','@hashgraph/sdk','@hashgraph/hedera-wallet-connect'],
  webpack(config, { dev }) {
    if (dev) {
      config.stats = 'errors-only'; // Show only errors in the terminal
    }
    return config;
  },
};

export default nextConfig;
