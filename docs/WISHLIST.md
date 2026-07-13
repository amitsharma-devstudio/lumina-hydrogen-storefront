# Wishlist — Lumina

Free custom wishlist: **localStorage for guests**, **customer metafield** when
signed in. No paid apps.

## What’s in the repo

| Piece | Status |
|-------|--------|
| Heart on PDP + product cards | Done |
| Guest save (browser localStorage) | Done |
| Logged-in sync (`lumina.wishlist` JSON metafield) | Done |
| Account → Wishlist page | Done |
| Header + account nav link | Done |
| Merge guest list on login | Done |

## Admin setup (required for cross-device sync)

Without this, hearts still work locally; signed-in sync to Shopify will fail.

1. Admin → **Settings → Custom data → Customers → Add definition**
2. Set:
   - **Name:** Wishlist  
   - **Namespace and key:** `lumina.wishlist`  
   - **Type:** JSON  
   - **Customer account access:** **Read and write**
3. Save.

If `metafieldsSet` returns `DISALLOWED_OWNER_TYPE`, the customer-account access
on that definition is still read-only or missing.

## How it behaves

- Tap the heart to save / unsave (optimistic UI).
- Guests: stored in `localStorage` (`lumina:wishlist`).
- Signed in: also written to the customer metafield via `/api/wishlist`.
- Opening **Account → Wishlist** after login merges any guest-saved items.

## Docs

- [Customer Account metafields](https://shopify.dev/docs/apps/build/customer-accounts/metafields-in-customer-accounts)
- [metafieldsSet](https://shopify.dev/docs/api/customer/latest/mutations/metafieldsSet)
