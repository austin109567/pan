import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true
})({
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'arweave.net',
      'www.arweave.net',
      'ipfs.io',
      'cloudinary.com',
    ],
  },
});

export default nextConfig;
