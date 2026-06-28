# Interview cheat sheet: loaders, URL state, pagination & filters

Short reference for **this Lumina Hydrogen storefront** (`/collections/all` and collection PLPs).

---

## React Router loaders (Hydrogen / Remix-style)

| Responsibility | Owner |
|----------------|--------|
| Fetch data (GraphQL via `storefront.query`) | **Loader** (server) |
| Render UI | **Route component** + children |
| Mount / unmount / re-render | **React** + React Router |
| Read data in UI | `useLoaderData()` |

**Loader does not** mount components or handle clicks.

---

## First visit vs later navigation

| When | Browser gets | Server runs |
|------|----------------|-------------|
| **First load** (type URL / hard refresh) | **HTML document** + JS (SSR) | Loader → GraphQL → render HTML |
| **In-app navigation** (filter, sort, load more) | **JSON only** (loader data) | Same loader → GraphQL again |
| | React **re-renders** (no full page reload) | |

- Client does **not** call Shopify Storefront GraphQL for catalog listing.
- Client changes **URL** → React Router refetches **loader** → server runs GraphQL.

**Not** classic CSR (empty HTML then client fetches everything on first paint).

---

## URL = source of truth (filters & sort)

Filters use `<Link to={href}>` — no `onClick` + client fetch.

The storefront does **not** hardcode which attributes are filterable — Shopify's
**Search & Discovery** app does. Each applied filter value carries Shopify's own
opaque `ProductFilter` JSON `input`, which we store verbatim in the URL. The
same pipeline works whether a facet is backed by a metafield, tag, option,
vendor, or price.

| URL param | Parsed/built by | Used for |
|-----------|-----------------|----------|
| `?filter={"productMetafield":{"namespace":"custom","key":"lumina_skin_type","value":"Oily"}}` (repeatable) | `parseAppliedFilters` | Applied `ProductFilter[]` + selected set |
| `?sort=PRICE_ASC` | `getCatalogSortFromRequest` / `buildSortedSearch` | Sort key |
| Toggle / clear a value | `buildToggledSearch()` / `buildClearedSearch()` | Next link href (preserves sort) |

All of the above live in `app/lib/catalogFacets.ts` (the adapter boundary).

**Loader flow** (`loadCollectionProducts`):

```text
request.url
  → getPaginationVariables(request, { pageBy: 12 })
  → getCatalogSortFromRequest(request) → getCatalogSortVariables(sort)
  → parseAppliedFilters(searchParams) → ProductFilter[]
  → CollectionProductsQuery({ ...pagination, ...sort, filters })
  → normalizeFacets(collection.products.filters)   // native, with counts
```

Facets are backed by **metafields** configured in the Search & Discovery app
(`custom.lumina_skin_type`, `custom.lumina_concern`,
`custom.lumina_active_ingredient`, `custom.lumina_badge`).

---

## GraphQL: `/collections/all` vs named collections

| Route | Query | Filters | Facet source |
|-------|--------|---------|--------------|
| `/collections/:handle` | `CollectionProductsQuery` | `collection.products(filters: [ProductFilter])` | Native `products.filters` (with counts) |
| `/collections/all` | `CatalogProductsQuery` → root `products` | **None** — sort + pagination only | — |

`/collections/all` is intentionally unfiltered: the root `products` connection
has no `filters` argument and native faceting is collection-scoped, and this
store has no virtual `all` collection. Faceted filtering lives on the named
collection PLPs. To add filters there later, point `/collections/all` at a real
(automated) collection and reuse `loadCollectionProducts`.

---

## Pagination: `pageInfo` ↔ URL ↔ `getPaginationVariables`

**Hydrogen built-in:** `getPaginationVariables` (reads URL).  
**Your query** must declare matching variables: `$first`, `$last`, `$startCursor`, `$endCursor`.

| URL | `getPaginationVariables` output | GraphQL (`products` / `collection.products`) |
|-----|----------------------------------|---------------------------------------------|
| (none) | `{ first: 12, endCursor: null }` | `first: 12`, `after: null` |
| `?cursor=X&direction=next` | `{ first: 12, endCursor: 'X' }` | `first: 12`, `after: 'X'` |
| `?cursor=Y&direction=previous` | `{ last: 12, startCursor: 'Y' }` | `last: 12`, `before: 'Y'` |

Variable names: `endCursor` → `after`, `startCursor` → `before`.

### Loop (URL is the bridge)

```text
Loader → GraphQL → pageInfo (hasNextPage, endCursor, …)
  → <Pagination connection={products}>
  → NextLink adds ?cursor=…&direction=next to URL
  → Loader runs again → getPaginationVariables(request) → GraphQL
```

- **`pageInfo` → Pagination** (outbound: build links).
- **`getPaginationVariables` ← URL** (inbound: next fetch).  
- Pagination and the loader do **not** call each other directly.

**Same route + new query params** (filter/sort/page): component usually **stays mounted**; `useLoaderData()` updates.

---

## vs pure client-side pagination

| URL-driven (this app) | Client state pattern |
|------------------------|----------------------|
| Cursor in URL | `useState(cursor)` |
| Loader fetches each page | `fetch` + append to `useState(items)` |
| Shareable / back button works | State lost on refresh unless synced to URL |

---

## One-liners (interview)

1. **Loaders fetch; components render; URL drives catalog state.**
2. **First request = HTML (SSR); later navigations = loader JSON.**
3. **Filters are links, not client GraphQL.**
4. **`getPaginationVariables` maps `cursor` + `direction` in the URL to GraphQL `first`/`after`.**
5. **`Pagination` turns `pageInfo` into those URL params on the next click.**
6. **Facets come from Shopify (Search & Discovery) backed by metafields, normalized once; the merchant — not the storefront — decides what's filterable. The storefront just renders `products.filters`.**

---

## Key files

| Topic | File |
|-------|------|
| All-products loader | `app/routes/($locale).collections.all.tsx` |
| Loader logic | `app/lib/loadAllProductsCatalog.ts` |
| Collection PLP loader | `app/lib/loadCollectionProducts.ts` |
| Facet adapter (normalize + URL ↔ ProductFilter) | `app/lib/catalogFacets.ts` |
| Filter UI | `app/components/catalog/CatalogFilterBar.tsx` |
| Pagination UI | `app/components/PaginatedResourceSection.tsx` |
| GraphQL (all) | `app/graphql/queries/CatalogProductsQuery.ts` |

See also: `docs/MENTAL_MODEL.md` (broader Hydrogen architecture).
