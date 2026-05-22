# Lumina skincare data model (Shopify Admin)

Use this as the **single source of truth** when creating metaobjects, metafields, and product content. Namespace for all product metafields: **`custom`**.

---

## Metaobject definitions

Create these in **Settings → Custom data → Metaobjects**.

### 1. `lumina_label` (reusable tag)

| Field key | Type | Example |
|-----------|------|---------|
| `label` | Single line text | `Oily` |

**Used for:** skin types (`skin_compatibility`), safe/avoid pairing lists.

---

### 2. `lumina_ingredient` (hero actives on PDP)

| Field key | Type | Example |
|-----------|------|---------|
| `label` | Single line text | `Hyaluronic Acid` |
| `inci` | Single line text (optional) | `Sodium Hyaluronate` |
| `target` | Single line text (optional) | `Multi-layer hydration` |

**Used for:** product metafield `lumina_hero_ingredients` (list of metaobject references).

---

### 3. `lumina_routine_step` (category label on PDP)

| Field key | Type | Example |
|-----------|------|---------|
| `label` | Single line text | `Hydration Step` |
| `category` | Single line text (optional) | `Treat` |

**Category values (recommended):** `Cleanse`, `Treat`, `Hydrate`, `Protect`, `Mask`.

**Used for:** product metafield `lumina_skin_care` (one metaobject reference).

---

### 4. `lumina_regimen` (shared routine carousel) — **recommended at scale**

One regimen entry powers the **“Complete the routine”** strip for many products.

| Field key | Type | Example |
|-----------|------|---------|
| `title` | Single line text | `The Lumina Regimen` |
| `description` | Multi-line text (optional) | Short intro under the heading |
| `products` | **List of products** (ordered) | Cleanser → Serum → Moisturizer |

**Admin steps:**

1. Create metaobject definition `lumina_regimen` with fields above.
2. **Content → Metaobjects → Add entry** (e.g. handle `core-3-step`).
3. Set `products` in the order shoppers should follow.
4. On each product, set metafield **`lumina_regimen`** → pick that regimen entry (single reference).

**Hydrogen resolution order:**

1. `lumina_regimen` (shared metaobject) — preferred  
2. `lumina_routine_products` (per-product product list) — fallback for one-off routines  

---

## Product metafields (namespace `custom`)

| Key | Type | Purpose |
|-----|------|---------|
| `lumina_hero_claim` | Single line text | Short claim under price |
| `lumina_how_to_use` | Multi-line text | Accordion |
| `lumina_full_ingredients` | Multi-line text | Accordion INCI list |
| `lumina_shipping_returns` | Multi-line text | Accordion policy |
| `lumina_rating` | Decimal | Star rating (e.g. `4.8`) |
| `lumina_reviews` | Integer | Review count |
| `lumina_step_order` | Integer | Routine step number (`1`, `2`, `3`) |
| `lumina_am_pm` | Single line text | `AM`, `PM`, or `AM & PM` |
| `lumina_skin_care` | Metaobject → `lumina_routine_step` | Step label + category |
| `lumina_hero_ingredients` | List → `lumina_ingredient` | Key actives |
| `skin_compatibility` | List → `lumina_label` | Skin type pills |
| `lumina_safe_with` | List → `lumina_label` | Green compatibility pills |
| `lumina_avoid_with` | List → `lumina_label` | Amber “avoid” pills |
| `lumina_product_benefits` | List → `lumina_label` | Trust lines under Add to cart (e.g. free shipping, vegan) |
| **`lumina_regimen`** | **Metaobject → `lumina_regimen`** | **Shared routine carousel (preferred)** |
| `lumina_routine_products` | List → **Product** | Per-product override (optional) |

---

## Example: assign regimen to many serums

1. Create regimen **`core-3-step`** with products: Cleanser, HA Serum, Moisturizer.
2. On **HA Serum**, **Niacinamide Serum**, **Vitamin C Serum**:
   - Set `lumina_regimen` → `core-3-step`
   - Set each product’s own `lumina_step_order` (e.g. serum = `2`)
3. PDP shows the same 3-step strip; current product is highlighted by **handle**.

You only edit the product list **once** on the regimen metaobject.

---

## Example: Hyaluronic Acid Serum (full PDP)

| Field | Value |
|-------|--------|
| `lumina_regimen` | → `core-3-step` |
| `lumina_hero_claim` | Clinically proven 72-hour hydration |
| `lumina_step_order` | `2` |
| `lumina_am_pm` | `AM & PM` |
| `lumina_skin_care` | → Hydration Step / category `Treat` |
| `lumina_hero_ingredients` | Hyaluronic Acid, Panthenol metaobjects |
| `skin_compatibility` | Normal, Dry, Combination |
| `lumina_safe_with` | Niacinamide, Ceramides |
| `lumina_avoid_with` | Pure Vitamin C (L-Ascorbic Acid) |
| `lumina_product_benefits` | → `Free shipping over $75`, → `30-day guarantee`, → `Vegan & cruelty-free` |

---

## Inventory on the storefront (PDP / Add to cart)

Admin **“22 available across all locations”** is not always the same number the **Storefront API** uses for `availableForSale`. The API only counts stock that can fulfill **online orders** for the shopper’s market.

**In Shopify Admin, verify:**

1. Product is **Active** and published to the **Online Store** sales channel.
2. Inventory is at a location that **fulfills online orders** (Settings → Locations).
3. The variant you’re viewing (e.g. 100ml vs 200ml) has stock — totals can be split per variant.
4. **Storefront API** access includes **“Read product inventory”** (`unauthenticated_read_product_inventory`) so Hydrogen can read `quantityAvailable` on variants.

**Hydrogen:** `app/lib/variantAvailability.ts` treats a variant as purchasable when `availableForSale` is true **or** `quantityAvailable > 0`.

---

## Where to create & show the routine metaobject

**Create once in Admin:** Content → Metaobjects → `lumina_regimen` → add entry (e.g. `core-3-step`) with ordered **products** list.

**Assign per product:** Product → Metafields → `lumina_regimen` → pick that entry. Many serums can share the same regimen.

| Surface | Purpose |
|---------|---------|
| **PDP — quick strip** (`RegimenQuickStrip`) | Right column under Add to cart. Shows metaobject title + 3 steps; highlights **current product**. Best for learning metaobjects in context. |
| **PDP — full section** (`CompleteTheRoutine`) | Below the fold (`#complete-routine`). Large visual routine with images and “Add step to bag”. |
| **Homepage (optional later)** | One featured regimen for brand story — not per SKU. Use when you want marketing, not product-specific context. |

**Recommendation for this dummy project:** configure regimens in Admin, assign on 2–3 products, showcase on **PDP only** (strip + full section). Skip homepage until you need a hero “Shop the routine” block.

---

## Querying in Hydrogen

- Regimen: `regimen.reference.fields[]` — find field key `products`, then `references.nodes` as `Product`
- Fallback: `routineProducts.references.nodes`
- Parsing: `resolveRegimen()` in `app/lib/skincare.ts`

---

## Scaling (5k SKUs × locales)

| Approach | When to use |
|----------|-------------|
| **`lumina_regimen`** | Same 3–5 step routine for a product line (most SKUs) |
| **`lumina_routine_products`** | Unique routine for one hero SKU only |
| **Tags + smart collections** | Merchandising / filters (not PDP routine strip) |

Translate regimen `title` / `description` via **Markets** on the metaobject entry.
