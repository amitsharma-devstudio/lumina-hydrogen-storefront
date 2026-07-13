# Subscriptions (selling plans) — Lumina

Storefront support for **Subscribe & save** via Shopify selling plans.
Uses the free **Shopify Subscriptions** app + Hydrogen selling-plan patterns.

## What’s in the repo

| Piece | Status |
|-------|--------|
| Product `sellingPlanGroups` query | Done |
| PDP one-time vs subscribe UI | Done |
| Add to cart with `sellingPlanId` | Done |
| Cart line shows plan name | Done |
| Account → Subscriptions (list + cancel) | Done |

## Admin setup (required before UI appears)

1. Install **[Shopify Subscriptions](https://apps.shopify.com/shopify-subscriptions)** (free).
2. In the app, create a plan (e.g. Deliver every 30 days, 10% off).
3. Open a product → **Purchase options** → assign that plan.
4. Confirm the Headless / Storefront API token includes  
   **`unauthenticated_read_selling_plans`**  
   (Admin → Settings → Apps → Headless / custom app → Storefront API scopes).

Without a plan on the product, the PDP purchase-options block stays hidden.

## How to test

1. Open a product that has a selling plan.
2. Choose **Subscribe & save**, pick an interval, click **Subscribe**.
3. Cart line should show the plan name; checkout uses Shopify’s subscription flow.
4. After a real subscription order, **Account → Subscriptions** lists contracts and allows cancel.

## Docs

- [Subscriptions in Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/subscriptions)
- [Selling plans Storefront API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/subscriptions)
