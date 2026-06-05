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

| URL param | Parsed by | Used for |
|-----------|-----------|----------|
| `?skin=normal` etc. | `parseCatalogFiltersFromRequest` | Active filters |
| `?sort=PRICE_ASC` | `getCatalogSortFromRequest` | Sort key |
| Built by | `catalogFiltersQueryString()` + `toggleCatalogFilter()` | Next link href |

**Loader flow** (`loadAllProductsCatalog`):

```text
request.url
  → getPaginationVariables(request, { pageBy: 12 })
  → getCatalogSortFromRequest(request) → getProductCatalogSortVariables(sort)
  → parseCatalogFiltersFromRequest(request) → buildShopifyProductsSearchQuery(filters)
  → CatalogProductsQuery({ ...pagination, ...sort, query })
```

---

## GraphQL: `/collections/all` vs named collections

| Route | Query | How filters apply |
|-------|--------|-------------------|
| `/collections/all` | `CatalogProductsQuery` → root `products` | `query: "tag:skin:normal AND ..."` (search syntax) |
| `/collections/:handle` | `CollectionProductsQuery` | `collection.products(filters: [{ tag }])` |

Filter **options** (sidebar labels): `loadCatalogFilterOptions()` — tags from store-wide facet query, not from current filter result.

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

---

## Key files

| Topic | File |
|-------|------|
| All-products loader | `app/routes/($locale).collections.all.tsx` |
| Loader logic | `app/lib/loadAllProductsCatalog.ts` |
| Collection PLP loader | `app/lib/loadCollectionProducts.ts` |
| Filters URL helpers | `app/lib/catalogFilters.ts` |
| Filter UI | `app/components/catalog/CatalogFilterBar.tsx` |
| Pagination UI | `app/components/PaginatedResourceSection.tsx` |
| GraphQL (all) | `app/graphql/queries/CatalogProductsQuery.ts` |

See also: `docs/MENTAL_MODEL.md` (broader Hydrogen architecture).
