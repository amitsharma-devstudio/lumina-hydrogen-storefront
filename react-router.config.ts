import type {Config} from '@react-router/dev/config';
import {hydrogenPreset} from '@shopify/hydrogen/react-router-preset';

/**
 * Local Mini Oxygen does not need v8_viteEnvironmentApi.
 * Cloudflare Workers builds do (`LUMINA_RUNTIME=cloudflare`).
 */
const useCloudflare = process.env.LUMINA_RUNTIME === 'cloudflare';

export default {
  presets: [hydrogenPreset()],
  ...(useCloudflare
    ? {
        future: {
          v8_viteEnvironmentApi: true,
        },
      }
    : {}),
} satisfies Config;
