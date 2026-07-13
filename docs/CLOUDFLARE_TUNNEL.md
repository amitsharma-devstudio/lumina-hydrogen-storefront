# Cloudflare for Lumina (local tunnel + production)

Use **Cloudflare** under the shared **`karwa.io`** zone (same pattern as the hotel apps).

| Environment | Hostname | Points to |
|-------------|----------|-----------|
| Local | `https://lumina-dev.karwa.io` | Named tunnel `lumina-dev` → `localhost:3001` |
| Production | `https://lumina.karwa.io` | Oxygen / Workers custom domain (later) |

Hotel reference domains on the same zone: `northscapestays.karwa.io`, `hoteladmin.karwa.io`.

See also `docs/CUSTOMER_ACCOUNT_API.md`.

---

## Prerequisites

1. `karwa.io` active in your Cloudflare account (already true for hotels).
2. `cloudflared` installed and logged in.
3. Tunnel `lumina-dev` already created.
4. `.env`:
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

`cloudflare/tunnel.yml` ingress hostname must be `lumina-dev.karwa.io` and `service` must match Vite (often `http://localhost:3001`).

### 3. Run

```bash
npm run dev      # terminal 1
npm run tunnel   # terminal 2
```

Open `https://lumina-dev.karwa.io`.

### 4. Headless OAuth URLs

| Setting | Local | Production (when ready) |
|---------|--------|-------------------------|
| Callback | `https://lumina-dev.karwa.io/account/authorize` | `https://lumina.karwa.io/account/authorize` |
| Origin / logout | `https://lumina-dev.karwa.io` | `https://lumina.karwa.io` |

---

## Production `lumina.karwa.io` (later)

Same idea as hotel custom domains: add **Custom domain** `lumina.karwa.io` on the production host (Oxygen or Workers), ensure DNS on `karwa.io`, set prod env `PUBLIC_STOREFRONT_ORIGIN=https://lumina.karwa.io`.
