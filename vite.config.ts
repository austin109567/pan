import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      nodePolyfills({
        include: ['crypto', 'buffer', 'stream'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'solana-vendor': [
              '@solana/wallet-adapter-base',
              '@solana/wallet-adapter-react',
              '@solana/wallet-adapter-react-ui',
              '@solana/wallet-adapter-wallets',
              '@solana/web3.js'
            ],
            'ui-vendor': [
              'lucide-react',
              'tailwindcss'
            ],
            'crypto-vendor': ['crypto-js']
          }
        },
        external: ['crypto']
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: true
    },
    resolve: {
      alias: {
        '@': '/src',
        'crypto': 'crypto-browserify',
        'stream': 'stream-browserify',
        'assert': 'assert',
        'http': 'stream-http',
        'https': 'https-browserify',
        'os': 'os-browserify',
        'url': 'url'
      }
    },
    server: {
      port: 5173,
      strictPort: true,
      https: false,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      }
    },
    optimizeDeps: {
      include: ['crypto-js'],
      esbuildOptions: {
        target: 'esnext',
        supported: { 
          bigint: true 
        },
      }
    },
    cacheDir: 'node_modules/.vite',
    worker: {
      format: 'es',
      plugins: []
    },
    publicDir: 'public',
    assetsInclude: ['**/*.mp4'],
    define: {
      // Expose env variables
      'process.env': env
    },
    envPrefix: ['VITE_']
  };
});