# Routine builder — Admin strategy (products → collections → metaobjects)

This is the **recommended way to run Lumina in Shopify Admin** before (or while) the homepage routine builder is wired in Hydrogen. The goal: **one clear place to maintain products**, and **small, meaningful metaobject entries** that do not duplicate your catalog.

---

## The three layers (in order)

```
┌─────────────────────────────────────────────────────────────┐
│  1. PRODUCTS — “What is this SKU?” (step type, concerns)   │
│     Set once when you create/edit the product               │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  2. COLLECTIONS — “Which routine does it belong to?”         │
│     Add product to morning-glow-routine, etc.                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  3. METAOBJECTS — “How do we sell the story on homepage?”   │
│     One bundle entry per concern; link collection + copy      │
│     (no need to re-pick every product if layer 1–2 are right) │
└─────────────────────────────────────────────────────────────┘
```

**Rule of thumb:** Products and collections are the **source of truth**. Metaobjects are **merchandising** (headlines, CTA, sort order), not a second catalog.

---

## Layer 1 — When you create a product

Every skincare SKU should answer two questions:

| Question | Why |
|----------|-----|
| **What step is it?** | Cleanse, Treat, or Moisturize |
| **Which goals does it support?** | Glow, Barrier, Clarity, Renewal (can be more than one) |

You only need **one** of the methods below per product (pick what is easiest for your team).

### Option A — Product tags (simplest, no metafield setup)

Add tags on the **product** in Admin:

| Tag pattern | Meaning | Example |
|-------------|---------|---------|
| `step:cleanse` | Step type | Cleanser |
| `step:treat` | Step type | Serum, toner, essence |
| `step:moisturize` | Step type | Cream, moisturizer |
| `routine:glow` | Fits Morning Glow routine | Optional, for filtering |
| `routine:barrier` | Fits Barrier routine | Optional |
| `routine:clarity` | Fits Clarity routine | Optional |
| `routine:renewal` | Fits Night Renewal routine | Optional |

**Example product — Cream Cloud Cleanser**

- Tags: `step:cleanse`, `routine:glow`, `routine:clarity`

Same product can appear in multiple routine collections if it fits multiple goals.

### Option B — Product metafield (cleaner at scale)

**Settings → Custom data → Products** → add definition:

| Namespace | Key | Type | Values |
|-----------|-----|------|--------|
| `custom` | `lumina_routine_step_type` | Single line text | `cleanse`, `treat`, `moisturize` |

Optional second metafield for goals (or keep using `routine:*` tags).

### Option C — Reuse existing `lumina_skin_care` metaobject

If you already assign **Skin care** on the PDP:

- Set metaobject field **`category`** to `Cleanse`, `Treat`, or `Moisturize` (see `SHOPIFY_SKINCARE_DATA_MODEL.md`).

That can double as the step type for routine mapping later.

---

## Layer 2 — When you create collections

You already have **four routine collections** (handles should match your storefront URLs):

| Collection title | Handle (example) | Role |
|------------------|------------------|------|
| Morning Glow Routine | `morning-glow-routine` | All SKUs for Glow goal |
| Barrier Repair Routine | `barrier-repair-routine` | Barrier goal |
| Clarity Routine | `clarity-routine` | Clarity goal |
| Night Renewal Routine | `night-renewal-routine` | Renewal goal |

**When adding a product to a collection:**

1. Open the product → **Collections** → add to the right routine collection(s).
2. Confirm **step type** is set (tag or metafield from Layer 1).
3. Aim for **at least one product per step** in that collection (ideally 2+ cleansers, 2+ serums, etc. if you want customer choice later).

**Sanity check per collection**

| Step | You should have… |
|------|------------------|
| Cleanse | 1+ products tagged `step:cleanse` (or metafield `cleanse`) |
| Treat | 1+ products with `step:treat` |
| Moisturize | 1+ products with `step:moisturize` |

If a step is empty, the routine builder cannot offer meaningful choices for that step.

**Shop collections (separate from routines)**  
Collections like `cleanser`, `serums`, `moisturizers` are for **Shop by category** navigation. A product can be in both `cleanser` and `morning-glow-routine`.

---

## Layer 3 — Metaobject entries (minimal, meaningful)

### What to create

| Definition | How many entries | Purpose |
|------------|------------------|---------|
| `lumina_routine_bundle` | **4** (Glow, Barrier, Clarity, Renewal) | Homepage concern + story + link to collection |
| `lumina_routine_step` | **Optional** | Only if you need custom per-step notes beyond product data |

You do **not** need 12 step entries if products and collections are tagged correctly and the storefront reads the collection (future Hydrogen work).

### `lumina_routine_bundle` — one entry per concern

**Settings → Custom data → Metaobjects → Routine bundle**

| Field key | Type | What to enter |
|-----------|------|----------------|
| `bundle_key` | Single line | `glow`, `barrier`, `clarity`, `renewal` |
| `goal` | Single line | Button label: `Glow`, `Barrier`, … |
| `title` | Single line | `Morning Glow Routine` |
| `description` | Multi-line | Marketing copy |
| `best_for` | Single line | Concerns |
| `expected_result` | Single line | Outcome line |
| `starting_from` | Money or text | `From $128` |
| `theme` | Single line | `glow` (matches `bundle_key`) |
| **`collection`** | **Collection** | **`morning-glow-routine`** (required) |
| `cta_label` | Single line | `Shop routine` |
| `sort_order` | Integer | `1`–`4` |
| Storefront API | — | **On** |

**Do not** manually duplicate every product on the bundle if the collection already contains them. The collection + product step tags are how mapping should work.

### Optional fields (only if you need overrides)

| Field key | Type | When to use |
|-----------|------|-------------|
| `cleanse_products` | List of products | Override/auto-fill cleanse step without tags |
| `treat_products` | List of products | Override treat step |
| `moisturize_products` | List of products | Override moisturize step |
| `steps` | List of metaobject refs | Legacy / custom notes per step |

Use overrides for hero picks (“featured cleanse”) while the collection holds the full list.

### `lumina_routine_step` — when to bother

Create step entries only if you need:

- A long **note** under a step (“Pick the milk cleanse if skin feels tight…”)
- A fixed order label (`01`, `02`, `03`) separate from products

Otherwise skip this definition entirely.

---

## How mapping flows into metaobjects (examples)

### Example A — Tags only (recommended to start)

**Product:** Gel Balance Cleanser  

- Tags: `step:cleanse`, `routine:clarity`  
- Collections: `clarity-routine`, `cleanser`

**Metaobject:** Clarity bundle  

- `collection` → Clarity Routine  
- Copy fields only — **no product lists on the metaobject**

**Storefront (when built):** Load collection products → group by `step:*` tag → show choices per step.

### Example B — Metafield for step, collection for routine

**Product:** Vitamin C Radiance Serum  

- Metafield `lumina_routine_step_type` = `treat`  
- Collection: `morning-glow-routine`

**Metaobject:** Glow bundle  

- `collection` → Morning Glow Routine  

### Example C — Explicit hero products on bundle (merchandising)

You want Glow step 1 to **default** to Cream Cloud Cleanser but still show 2 other cleansers from the collection.

**Bundle entry:**

- `collection` → Morning Glow Routine  
- `cleanse_products` → [Cream Cloud Cleanser] (featured default)  
- Other cleansers come from collection + tags when the app supports it  

---

## Checklist: adding a new SKU

1. Create product (title, price, image, Online Store channel).
2. Set **step type** — tag `step:cleanse` / `step:treat` / `step:moisturize` **or** metafield.
3. Set **goals** — tags `routine:glow`, etc., if it applies to multiple routines.
4. Add to **shop collection** (`cleanser`, `serums`, …) if applicable.
5. Add to **routine collection(s)** (`morning-glow-routine`, …).
6. Confirm each routine collection still has ≥1 product per step type.
7. **No metaobject edit** unless you change homepage copy or featured overrides.

---

## Checklist: new routine goal (5th concern)

1. Create collection `sensitivity-routine` (example).
2. Tag/add products with `routine:sensitivity` and step tags.
3. Create **one** new `lumina_routine_bundle` entry pointing at that collection.
4. Set `sort_order` and publish.

---

## What not to do

| Avoid | Why |
|-------|-----|
| 12 step metaobjects with one product each | Duplicates catalog; hard to maintain |
| Putting all products on bundle with no step tags | Storefront cannot split Cleanse / Treat / Moisturize |
| Relying on Shopify **Store category** only | Lumina does not read Store category for routines |
| Different step tags in collection vs on product | Product tag/metafield should be the step truth |

---

## How this connects to Hydrogen (today vs later)

| Today (main branch) | Homepage `HomeRoutineStrip` is a static 3-step explainer linking to `cleanser` / `serums` / `moisturizers`. |
| Later | Wire bundle metaobject + collection products grouped by step tag/metafield → real routine builder UI. |

This doc is the **Admin contract** for that future build: **products + collections first**, **lean metaobjects second**.

---

## Quick reference — your four collections

| Concern | Collection handle | Bundle `bundle_key` |
|---------|-------------------|---------------------|
| Glow | `morning-glow-routine` | `glow` |
| Barrier | `barrier-repair-routine` | `barrier` |
| Clarity | `clarity-routine` | `clarity` |
| Renewal | `night-renewal-routine` | `renewal` |

---

## Related docs

- `SHOPIFY_SKINCARE_DATA_MODEL.md` — PDP metafields, `lumina_regimen`, ingredients  
- `DEMO_V1_CHECKLIST.md` — collection handles for shop navigation  
