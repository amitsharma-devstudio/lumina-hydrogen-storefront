/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

/**
 * Extra public env for Cloudflare tunnel / custom auth domains.
 * Core Shopify vars come from Hydrogen / Oxygen typings.
 */
declare global {
  interface Env {
    /**
     * Set to `"true"` when using Cloudflare Tunnel / custom HTTPS
     * instead of Hydrogen's `*.tryhydrogen.dev` tunnel.
     */
    PUBLIC_CUSTOM_AUTH_DOMAIN?: string;
    /**
     * Public HTTPS origin users open in the browser.
     * Local: `https://dev.lumina.karwa.io`
     * Prod:  `https://lumina.karwa.io`
     */
    PUBLIC_STOREFRONT_ORIGIN?: string;
  }
}

export {};
