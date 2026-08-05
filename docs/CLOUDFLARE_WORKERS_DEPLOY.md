# Deploy Lumina to Cloudflare Workers (`lumina.karwa.io`)

**Production** self-hosts on a **Cloudflare Worker** under the shared **`karwa.io`** zone
(Oxygen hosting is paid, so we do not deploy there).

**Local development** uses free **Mini Oxygen** (`npm run dev`) — not Cloudflare
`workerd` — so it still runs on macOS 12. Only `npm run build:cf` / `npm run deploy`
enable the Cloudflare Vite plugin via `LUMINA_RUNTIME=cloudflare`.

| Environment | Hostname | Runtime |
|-------------|----------|---------|
| Local | `http://localhost:…` or tunnel `lumina-dev.karwa.io` | Mini Oxygen (Vite) |
| Production | `https://lumina.karwa.io` | Cloudflare Worker `lumina-storefront` |

Hotel reference domains on the same zone: `northscapestays.karwa.io`, `hoteladmin.karwa.io`.

---

## Prerequisites

1. **Node.js ≥ 18** for local Mini Oxygen; **≥ 22** recommended for Wrangler 4 deploy.
2. Cloudflare account with `karwa.io` zone (already used for hotels).
3. `npx wrangler login` once.
4. Shopify Headless channel with Storefront + Customer Account API credentials.
5. Local secrets file:
   ```bash
   cp .dev.vars.example .dev.vars
   # paste values from your `.env`
   ```

---

## One-time project setup (already scaffolded)

| File | Role |
|------|------|
| `wrangler.jsonc` | Worker name `lumina-storefront`, `nodejs_compat`, entry `server.ts` |
| `vite.config.ts` | Mini Oxygen by default; Cloudflare when `LUMINA_RUNTIME=cloudflare` |
| `.dev.vars` | Local Worker env (gitignored) |
| `npm run deploy` | `build:cf` + `wrangler deploy` |

---

## Deploy steps

### 1. Auth + secrets

```bash
npx wrangler login

# Upload all keys from .dev.vars as Worker secrets
npx wrangler secret bulk .dev.vars
```

Then set **production** origin (dashboard → Worker → Settings → Variables, or re-bulk after editing):

```bash
PUBLIC_STOREFRONT_ORIGIN=https://lumina.karwa.io
PUBLIC_CUSTOM_AUTH_DOMAIN=true
```

Keep `SESSION_SECRET` and API tokens as **secrets**, not plaintext vars, when possible.

### 2. Build & deploy

```bash
npm run deploy
# = npm run build:cf && wrangler deploy
```

Wrangler prints a `*.workers.dev` URL. Smoke-test that before attaching the custom domain.

Dry-run without publishing:

```bash
npm run cf-check
```

### 3. Custom domain `lumina.karwa.io`

`wrangler.jsonc` already has:

```jsonc
"routes": [{ "pattern": "lumina.karwa.io", "custom_domain": true }]
```

Redeploy so Wrangler attaches the domain (same Cloudflare account as zone `karwa.io`):

```bash
npm run deploy
```

Cloudflare creates DNS + SSL on `karwa.io` for you.

**Dashboard alternative:** Workers → **lumina-storefront** → **Settings** → **Domains & Routes** → **Add** → **Custom Domain** → `lumina.karwa.io`.

### 4. Customer Account OAuth

In Headless → Customer Account API application, add production URLs (keep local tunnel URLs too):

| Setting | Value |
|---------|--------|
| Callback | `https://lumina.karwa.io/account/authorize` |
| JavaScript origin | `https://lumina.karwa.io` |
| Logout | `https://lumina.karwa.io` |

See [CUSTOMER_ACCOUNT_API.md](./CUSTOMER_ACCOUNT_API.md).

### 5. Smoke test

- `https://lumina.karwa.io` — home / collection / PDP
- Add to cart → checkout
- Account login / logout
- `npx wrangler tail` while testing for runtime errors

---

## Local development after the migration

| Command | Use |
|---------|-----|
| `npm run dev` | **Default** — Mini Oxygen local SSR (works on macOS 12) |
| `npm run tunnel` | Stable HTTPS `lumina-dev.karwa.io` for OAuth |
| `npm run build:cf` / `npm run deploy` | Cloudflare Workers build (needs macOS 13.5+ or Linux CI) |

Use **`npm run dev` + tunnel** for day-to-day and OAuth testing. Put tunnel-origin values in `.env` / `.dev.vars` (`PUBLIC_STOREFRONT_ORIGIN=https://lumina-dev.karwa.io`).

Do **not** use the Cloudflare Vite plugin for local on older macOS — `workerd` requires 13.5+.

---

## Rollback

```bash
npx wrangler deployments list
npx wrangler rollback
```

---

## CI (optional)

Workers Builds or GitHub Action:

- **Build:** `npm run build:cf`
- **Deploy:** `npx wrangler deploy`
- Secrets: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
