import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {cloudflare} from '@cloudflare/vite-plugin';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

/**
 * Local: Mini Oxygen (free local SSR — works on macOS 12).
 * Prod build/deploy: Cloudflare Workers (`LUMINA_RUNTIME=cloudflare`).
 * Do not enable oxygen() and cloudflare() at the same time.
 */
const useCloudflare = process.env.LUMINA_RUNTIME === 'cloudflare';

export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    useCloudflare
      ? cloudflare({viteEnvironment: {name: 'ssr'}})
      : oxygen(),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    // Cloudflare Tunnel hostnames used in local OAuth testing
    allowedHosts: ['.tryhydrogen.dev', '.karwa.io', 'lumina-dev.karwa.io'],
  },
});
