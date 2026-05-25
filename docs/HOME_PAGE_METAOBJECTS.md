# Homepage metaobjects (Lumina)

The homepage loads **hero and promo content from Shopify metaobjects**. CTAs use the URLs you set in Admin (`cta_url`, `primary_cta_url`, etc.); full Shopify URLs are converted to in-app paths automatically.

## `home_hero` (single entry)

**Type:** `home_hero`  
**Storefront API type:** `home_hero` (same handle)

| Field key | Type | Notes |
|-----------|------|--------|
| `headline` | Single line | Main H1 |
| `subhead` | Multi line | Supporting copy |
| `primary_cta_url` | JSON / URL | Link object: `{ "url": "...", "text": "Shop now" }` |
| `secondary_cta_url` | JSON / URL | Optional second CTA |
| `starting_from_label` | Single line | e.g. `Starting from` |
| `starting_from_value` | Money or text | e.g. `$32` |
| `image` | File (image) | Hero photography |

Publish **one** metaobject entry. If missing, the hero section is hidden.

## `home_promo_banner` (multiple entries → carousel)

**Type:** `home_promo_banner`  
Load up to **8** entries; they rotate in the promo carousel.

| Field key | Type | Notes |
|-----------|------|--------|
| `title` or `headline` | Single line | Slide headline |
| `subtitle` or `subhead` | Single line | Optional |
| `cta_url` or `link` | JSON / URL | `{ "url": "/collections/bestsellers", "text": "Shop bestsellers" }` or full store URL |
| `image` | File (image) | Background (16:9 recommended) |

If **no** entries exist, the promo carousel is hidden.

## Admin checklist

1. **Settings → Custom data → Metaobjects** — create definitions above (or import via Shopify CLI).
2. Add **one** `home_hero` entry with image + CTAs to `/collections/all`.
3. Add **2–3** `home_promo_banner` entries for a live carousel.
4. Set each metaobject to **Active** and available on the **Storefront** API.

## Homepage section order

1. Hero (metaobject)  
2. Promo carousel (metaobjects)  
3. Shop by category pills  
4. Bestsellers  
5. Routine strip (3 steps)  
6. Curated collections  
7. New arrivals  
8. Social proof  
9. Features  
10. Newsletter  
