import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const MODE = process.env.NODE_ENV
const development = MODE === 'development'

export default {
  // other config options
  plugins: [
    development &&
      react(),
      nodePolyfills({
        include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js'), 'http', 'crypto']
      })
  ],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      zlib: 'browserify-zlib'
    }
  },
  build: {
    rollupOptions: {
      external: ['@web3-onboard/*'],
      plugins: [
        nodePolyfills({ include: ['crypto', 'http'] }),
        inject({ Buffer: ['Buffer', 'Buffer'] })
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    exclude: ['@ethersproject/hash', 'wrtc', 'http'],
    include: [
      '@web3-onboard/core',
      '@web3-onboard/gas',
      '@web3-onboard/sequence',
      'js-sha3',
      '@ethersproject/bignumber'
    ],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  },
  define: {
    global: 'window'
  }
}