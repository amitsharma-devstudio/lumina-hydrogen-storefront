# Hydrogen Mental Model (Interview Notes)

This document is a **learning + interview** map of how this Hydrogen (React Router + Oxygen) storefront works. It’s written to help you explain *why* the code is structured this way, and how to debug/optimize it like a Solution Architect.

## Request lifecycle (Oxygen → HTML)

**Goal**: understand what runs *where* (edge runtime vs app code) and where data is fetched.

- **Edge entry**: `server.ts`
  - Receives the request in Oxygen.
  - Creates Hydrogen context via `createHydrogenRouterContext()` (`app/lib/context.ts`).
  - Delegates to React Router via `createRequestHandler({build, getLoadContext})`.
- **SSR rendering**: `app/entry.server.tsx`
  - Builds CSP + nonce (`createContentSecurityPolicy`).
  - Renders `<ServerRouter />` for the requested URL.
- **App shell / root data**: `app/root.tsx`
  - `loader()` fetches global data (header, footer, cart, logged-in state, analytics/consent config).
  - `Layout()` sets HTML skeleton + CSS + `<Scripts />` + `<ScrollRestoration />`.
  - `App()` wraps routes with analytics provider and `PageLayout`.
- **Hydration**: `app/entry.client.tsx`
  - Hydrates via `<HydratedRouter />`.

### Key architectural rule

**Storefront API calls should happen in loaders**, not deep in client components. That gives:
- SEO-safe SSR HTML
- predictable caching
- centralized error handling
- less client waterfall

## Data sources (what lives in “context”)

Hydrogen injects capabilities into `context` inside loaders/actions.

- **Storefront API client**: `context.storefront`
  - Use for GraphQL queries to your Shopify store.
- **Cart**: `context.cart`
  - Server-side cart operations + cookie-based cart id.
- **Session**: `context.session`
  - Cookie session wrapper (`app/lib/session.ts`).
- **i18n**: `context.storefront.i18n`
  - Locale parsed from URL (`app/lib/i18n.ts`) and route prefix `($locale)`.

## PDP mental model (Product Details Page)

**Route**: `app/routes/($locale).products.$handle.tsx`

### What the loader is doing

- Reads the product handle from the URL params.
- Uses **URL-selected options**:
  - `getSelectedProductOptions(request)` extracts `?Size=...&Color=...` style params.
  - Those are sent into the GraphQL query so the server returns the correct variant.
- Runs the query:
  - `storefront.query(ProductByHandleQuery, {variables: {handle, selectedOptions}})`
  - Query lives in `app/graphql/queries/ProductByHandle.ts` and composes fragments.

### Why “selected options in URL” matters (interview answer)

- **Deep links**: variant selection is shareable.
- **Back/forward**: browser navigation works.
- **SEO**: avoids client-only variant state that bots don’t see.
- **Caching**: the URL represents the state; caches can key correctly.

### Variant selection pattern

Even after the query, Hydrogen provides helpers to keep variant selection stable:
- `useOptimisticVariant(...)`
- `getAdjacentAndFirstAvailableVariants(product)`
- `getProductOptions(...)`
- `useSelectedOptionInUrlParam(...)`

These exist to handle “invalid option combos”, adjacent variants, and smooth transitions.

### UI wiring

- UI component: `app/components/product/ProductDetailPage.tsx`
- Variant UI: `app/components/VariantPicker.tsx` (links based navigation)
- Add-to-cart: `app/components/AddToCartButton.tsx` uses `CartForm` to POST to `/cart`.

## Cart mental model (Cart Page)

**Route**: `app/routes/($locale).cart.tsx`

### Loader (read)

- `loader()` calls `context.cart.get()` and returns the cart.
- Cart id is stored in cookies (Hydrogen manages this).

### Action (mutate)

- `action()` reads `CartForm.getFormInput(formData)` and maps to:
  - `cart.addLines`
  - `cart.updateLines`
  - `cart.removeLines`
  - `cart.updateDiscountCodes`, etc.
- After mutations, it calls `cart.setCartId(cartId)` to keep the cookie consistent.

### Why this pattern is used (interview answer)

- Server is the source of truth for cart mutations.
- UI can be **optimistic** (`useOptimisticCart` in `app/components/CartMain.tsx`).
- Avoids client-side “API spaghetti”.

## Home route mental model (Landing page)

**Route**: `app/routes/($locale)._index.tsx`

### What the loader is doing (minute details)

The home page intentionally uses a **critical + deferred** pattern:

- **Critical** (`loadCriticalData`)
  - Runs `context.storefront.query(FEATURED_COLLECTION_QUERY)` and **awaits** it.
  - This means SSR HTML can render the main “featured collection” without placeholders.
- **Deferred** (`loadDeferredData`)
  - Starts `context.storefront.query(RECOMMENDED_PRODUCTS_QUERY)` but does **not** await.
  - Errors are **caught and converted to `null`**, so the page still returns `200` even if recommendations fail.

In the `loader()` you’ll see:
- `const deferredData = loadDeferredData(args);` (returns promises)
- `const criticalData = await loadCriticalData(args);` (blocks)
- `return {...deferredData, ...criticalData};` (merges both)

### Why `Suspense` + `Await` is used

`recommendedProducts` is a **Promise**, so the UI renders it like this:

- `<Suspense fallback=...>` renders the fallback while the Promise is pending.
- `<Await resolve={products}>` “unwraps” the Promise once it resolves and passes the resolved value into a render function.

Architect interview answer:
- “We treat below-the-fold content as **non-blocking** to improve TTFB/LCP and isolate failure.”
- “SSR returns quickly with critical HTML; deferred content streams in without a client fetch waterfall.”

### What we will change (and what we will keep)

We will keep:
- Storefront API calls in the route loader (server boundary)
- Critical vs deferred split
- `Suspense/Await` for below-the-fold sections
- Small query payloads (only fields needed by the UI)

We will change:
- The markup/layout to match the `skincare-store(1).html` UX (Hero → Bestsellers → Features → Newsletter)
- The mapping of data:
  - “Bestsellers” can be powered by recommended products initially, then later by a dedicated “bestsellers” collection/menu strategy.

## GraphQL strategy (why fragments + queries are structured this way)

**Goal**: keep the data contract stable, reusable, and type-safe.

- Queries live in `app/graphql/queries/**`.
- Reusable fragments live in `app/graphql/fragments/**`.
- Codegen types land in `storefrontapi.generated.d.ts`.

### How to talk about it in interviews

- “Fragments are our **domain schema**. They prevent query sprawl and ensure UI contracts are explicit.”
- “Each route has *one* critical query for above-the-fold, and defers below-the-fold queries to improve TTFB/LCP.”

## Shopify Storefront GraphQL primer (for newbies)

If you’re coming from SQL: Shopify does **not** expose “tables” to you. In GraphQL you query a **schema** (a graph of types). Think:
- **Types** ≈ “tables”
- **Fields** ≈ “columns”
- **Connections** (`products(first: 4) { nodes { ... } }`) ≈ “one-to-many relationships with pagination”

### The 5 Shopify types you’ll touch constantly

- **`Product`**: title/handle/description, options, images, variants, metafields/metaobjects.
- **`ProductVariant`**: the purchasable unit (`id`, `availableForSale`, `price`, `selectedOptions`).
- **`Collection`**: groups of products (`handle`, `title`, `image`, `products(...)`).
- **`Cart`**: lines + costs + checkoutUrl; created/updated via mutations (Hydrogen wraps this).
- **`Metaobject` / `Metafield`**: structured custom content you attach to products.

### Why Shopify queries look like `first + nodes`

Shopify uses the Relay “connection” pattern for lists:
- `images(first: 10) { nodes { ... } }`
- `variants(first: 10) { nodes { ... } }`
- `products(first: 4) { nodes { ... } }`

Architect reason:
- Pagination is explicit.
- Payload is controlled (you decide how many).
- You can scale without accidental “fetch all”.

### Variables + `@inContext` (country/language)

Many queries include:
- `$country: CountryCode, $language: LanguageCode`
- `@inContext(country: $country, language: $language)`

Meaning: same query returns **localized pricing/content** depending on the shopper context (Hydrogen sets this via i18n in the request context).

### PDP pattern: handle + selectedOptions

Your PDP uses the canonical pattern:

- Fetch product by **handle** (stable URL id)
- Compute variant selection using **selected options** from the URL

See `app/graphql/queries/ProductByHandle.ts`:

- `product(handle: $handle)` fetches the product “root”
- `selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ...)` picks the right variant
- `variants(first: 10)` loads a small set of variants for option UI
- `images(first: 10)` loads gallery images
- `...SkincareProduct` fetches metafields/metaobjects for your domain content

Architect interview answer:
- “We use URL-selected options so variant selection is shareable, SEO-safe, and stable across navigation.”
- “We keep variant payload bounded (first: 10) until UX proves we need more.”

### Metafields/metaobjects in GraphQL (your examples)

In `app/graphql/fragments/SkincareProductFragment.ts` you query custom product data:
- scalar metafields like `lumina_rating`, `lumina_reviews`
- reference metafields that point to **metaobjects**, using `references { nodes { ... on Metaobject { field(key: ...) }}}`

This is Shopify’s “CMS inside Shopify” model:
- **Metafield** = custom field attached to a resource (product/variant/etc).
- **Metaobject** = structured record (like a CMS entry) referenced by metafields.

### How to learn “what fields exist”

Use the local GraphiQL your dev server exposes:
- `/graphiql`

Workflow:
- Start from a known type (`Product`, `Cart`, `Collection`)
- Explore fields + their return types
- Decide your UI contract, then pull only those fields

## Performance & debugging playbooks (fast diagnosis)

### Page loads forever

1) **Check port conflicts** (common when multiple dev servers run):

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

2) **Check subrequest profiler**
- Visit `/subrequest-profiler` to see Storefront API calls and timings.

3) **Check env injection**
- Missing `PUBLIC_STORE_DOMAIN`, token, or checkout domain can cause fetch issues.

### PDP variant “wrong” or flaky

- Confirm URL has selected option params.
- Confirm loader passes `selectedOptions` into query.
- Confirm query returns `selectedOrFirstAvailableVariant`.
- Confirm UI uses `productOptions` derived from Hydrogen helpers.

### Cart not updating / “Add to cart” does nothing

- Ensure the submit is going through `CartForm` to `/cart`.
- Verify `/cart` `action()` handles the right `CartForm.ACTIONS.*`.
- Ensure cart id cookie is being set after mutation.

