# Demo v1 checklist (no metaobjects)

Tick off in Shopify Admin before an agency / client demo.

## Collections (handles must match URL slugs in Admin)

Your store titles → expected handles:

| Title in Admin | Typical handle |
|--------------|----------------|
| New Arrivals | `new-arrivals` |
| Cleanser | `cleanser` |
| Bestseller | `bestseller` |
| Moisturizers | `moisturizers` |
| Serums | `serums` |
| Hydration | `hydration` |
| Masks | `masks` |

- [ ] All 7 published to **Online Store**
- [ ] Products assigned to each
- [ ] **`/collections`** shows all 7 cards (collection index)
- [ ] **`/collections/all`** shows **products** (full catalog), not collection cards

## Products (5+ SKUs)

- [ ] Active, published to **Online Store**
- [ ] Images + price on each
- [ ] Inventory at an online-fulfilling location
- [ ] Tags for filters, e.g. `skin:normal`, `concern:brightening`

## URLs to click in the demo

1. `/` — homepage grids
2. `/collections` — collection cards
3. `/collections/all` — shop all + filters
4. `/collections/bestsellers` — sort + filters
5. `/products/{hero-handle}` — PDP + add to cart
6. `/cart` — checkout CTA

## Homepage metaobjects (optional — fallbacks work without them)

- [ ] `home_hero` — headline, image, CTAs (see `HOME_PAGE_METAOBJECTS.md`)
- [ ] `home_promo_banner` — 2+ slides for promo carousel

## Optional later (v2)
- [ ] `lumina_regimen` + PDP metafields (see `SHOPIFY_SKINCARE_DATA_MODEL.md`)
