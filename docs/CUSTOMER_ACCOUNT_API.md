# Customer Account API — Lumina setup

Account **UI and routes are done**. Live OAuth needs Shopify Admin + env
credentials. Prefer **Cloudflare Tunnel** for local HTTPS and your Cloudflare
domain for production — see **`docs/CLOUDFLARE_TUNNEL.md`**.

## What’s already in the repo

| Piece | Status |
|-------|--------|
| `/account/login` → `customerAccount.login()` | Done |
| `/account/authorize` → `customerAccount.authorize()` | Done |
| `/account/logout` | Done |
| Orders / profile / addresses UI | Done |
| Header account icon | Done |
| Cloudflare custom auth (`PUBLIC_CUSTOM_AUTH_DOMAIN`) | Done |
| CSP `connect-src` for tunnel origin | Done |

## Required `.env`

```bash
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=shp_...   # or UUID from Headless Customer Account API
SHOP_ID=70314459323                             # numeric id from shopify.com/{SHOP_ID}/account
PUBLIC_CUSTOM_AUTH_DOMAIN=true
PUBLIC_STOREFRONT_ORIGIN=https://lumina-dev.karwa.io
```

**Important:** Without `SHOP_ID`, login opens  
`https://shopify.com/authentication/undefined/oauth/authorize` and fails.

Find `SHOP_ID`: Admin → **Settings → Customer accounts** — the account URL looks like  
`https://shopify.com/70314459323/account` → use `70314459323`.

Do not wrap values in quotes in `.env`.

## Local (Cloudflare) — short version

1. One-time: named tunnel + DNS for `lumina-dev.karwa.io` (see `docs/CLOUDFLARE_TUNNEL.md`).
2. Headless Application setup: callback / origin / logout for that host.
3. `npm run dev` + `npm run tunnel`.
4. Open **`https://lumina-dev.karwa.io`** → account login.

## Production

Register `https://lumina.karwa.io` (callback + origin + logout) alongside local URLs in Headless settings. Point Cloudflare DNS at Oxygen (or a production tunnel).

## Fallback: Hydrogen tunnel

`npm run dev:accounts` still exists, but needs Hydrogen channel access for `--customer-account-push`. Cloudflare is the path for this Headless store.

## Official docs

- [Customer Account API + Hydrogen](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/hydrogen)
- [Getting started](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
