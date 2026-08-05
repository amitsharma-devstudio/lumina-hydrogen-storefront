/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

/**
 * Cloudflare Worker env (Wrangler + dashboard secrets/vars).
 * Run `npm run cf-typegen` after changing wrangler.jsonc bindings.
 */
declare global {
  // Merged with generated CloudflareEnv when present.
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_API_VERSION?: string;
    PUBLIC_CHECKOUT_DOMAIN: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_URL?: string;
    PUBLIC_STOREFRONT_ID?: string;
    PRIVATE_STOREFRONT_API_TOKEN?: string;
    SHOP_ID?: string;
    /**
     * Set to `"true"` when using Cloudflare Tunnel / custom HTTPS
     * instead of Hydrogen's `*.tryhydrogen.dev` tunnel.
     */
    PUBLIC_CUSTOM_AUTH_DOMAIN?: string;
    /**
     * Public HTTPS origin users open in the browser.
     * Local: `https://lumina-dev.karwa.io`
     * Prod:  `https://lumina.karwa.io`
     */
    PUBLIC_STOREFRONT_ORIGIN?: string;
  }
}

export {};
