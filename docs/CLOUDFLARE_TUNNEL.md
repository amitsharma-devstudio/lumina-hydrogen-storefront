# Cloudflare for Lumina (local tunnel + production)

Use **Cloudflare** under the shared **`karwa.io`** zone (same pattern as the hotel apps).

| Environment | Hostname | Points to |
|-------------|----------|-----------|
| Local | `https://lumina-dev.karwa.io` | Named tunnel `lumina-dev` → Vite |
| Production | `https://lumina.karwa.io` | Worker `lumina-storefront` custom domain |

**Production deploy:** [CLOUDFLARE_WORKERS_DEPLOY.md](./CLOUDFLARE_WORKERS_DEPLOY.md) (Oxygen is not used).

Hotel reference domains on the same zone: `northscapestays.karwa.io`, `hoteladmin.karwa.io`.

See also `docs/CUSTOMER_ACCOUNT_API.md`.

---

## Prerequisites

1. `karwa.io` active in your Cloudflare account (already true for hotels).
2. `cloudflared` installed and logged in.
3. Tunnel `lumina-dev` already created.
4. `.dev.vars` (copy from `.dev.vars.example` / `.env`):
   ```bash
   PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=shp_...
   PUBLIC_CUSTOM_AUTH_DOMAIN=true
   PUBLIC_STOREFRONT_ORIGIN=https://lumina-dev.karwa.io
   ```

---

## Local stable hostname — steps

### 1. Route DNS (creates proxied CNAME on `karwa.io`)

```bash
cloudflared tunnel route dns lumina-dev lumina-dev.karwa.io
```

In Dashboard → **karwa.io** → **DNS**, confirm:

- Name: `lumina-dev`
- Target: `a364adf4-a28f-4f11-a219-2a392daab0cf.cfargotunnel.com`
- Proxy: **orange (Proxied)**

### 2. Point tunnel config at that host

`cloudflare/tunnel.yml` ingress hostname must be `lumina-dev.karwa.io`.
The `service` port is optional to keep accurate — `npm run tunnel` rewrites it
to whatever Vite is listening on.

### 3. Run

```bash
npm run dev      # terminal 1 — Mini Oxygen local SSR
npm run tunnel   # terminal 2 — detects Vite port (3000/3001/…) automatically
```

`npm run tunnel` probes common local ports (or `PORT=…`), writes
`cloudflare/tunnel.runtime.yml`, and points `lumina-dev.karwa.io` at that origin.
You do not need to edit the port in `tunnel.yml` by hand.

Open `https://lumina-dev.karwa.io`.

### 4. Headless OAuth URLs

| Setting | Local | Production |
|---------|--------|------------|
| Callback | `https://lumina-dev.karwa.io/account/authorize` | `https://lumina.karwa.io/account/authorize` |
| Origin / logout | `https://lumina-dev.karwa.io` | `https://lumina.karwa.io` |

---

## Production `lumina.karwa.io`

Full checklist: [CLOUDFLARE_WORKERS_DEPLOY.md](./CLOUDFLARE_WORKERS_DEPLOY.md).

Summary: `npm run deploy` → add custom domain `lumina.karwa.io` → set `PUBLIC_STOREFRONT_ORIGIN=https://lumina.karwa.io` → register OAuth URLs.
