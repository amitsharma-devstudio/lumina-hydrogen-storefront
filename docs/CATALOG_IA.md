# Catalog information architecture (Lumina)

Reference for portfolio demos and phased rollout.

## URL map

| URL | Purpose | Implementation |
|-----|---------|----------------|
| `/collections` | **All merchandising collections** (New Arrivals, Serums, etc.) | `CollectionCard` grid — **not** `/collections/all` |
| `/collections/all` | **All products** in the store (Shopify catalog) | `CollectionProductsPage`; products only |
| `/collections/:handle` | Curated collection PLP | Same shell + sort + tag filters |
| `/products` | Redirect | → `/collections/all` |
| `/products/all` | Redirect | → `/collections/all` |
| `/products/:handle` | PDP | `ProductDetailPage` |

## Shared components

| Component | Role |
|-----------|------|
| `CollectionCard` | Collection index + homepage |
| `ProductCard` | All product grids |
| `CollectionProductsPage` | PLP shell (header, sort, filters, grid) |
| `CatalogFilterBar` | Tag-based filters (`skin:`, `concern:`, `badge:`, `active:`) |
| `Breadcrumbs` | Catalog PLPs, collections index, search |
| `ProductCardFragment` | GraphQL contract for PLP cards |

## Product tags (Admin → PLP filters)

Use namespaced tags on products:

| Prefix | Example | URL param |
|--------|---------|-----------|
| `skin:` | `skin:normal` | `?skin=normal` |
| `concern:` | `concern:brightening` | `?concern=brightening` |
| `badge:` | `badge:new` | `?badge=new` |
| `active:` | `active:vitamin-c` | `?active=vitamin-c` |

Filters are **AND** combined. Options are built from tags on products in the collection (or full catalog).

## Phases

| Phase | Status | Scope |
|-------|--------|--------|
| **1** | Done | Unified PLP, redirects, `ProductCard`, catalog IA |
| **2** | Done | Tag filters on collection PLPs + `/collections/all` |
| **3** | Done | Breadcrumbs, search `ProductCard` grid, `/collections` hero |
| **4** | Planned | `COMPONENT_MAP.md`, README demo script |
| **Metaobjects** | Later | Regimen / PDP intelligence (`SHOPIFY_SKINCARE_DATA_MODEL.md`) |
