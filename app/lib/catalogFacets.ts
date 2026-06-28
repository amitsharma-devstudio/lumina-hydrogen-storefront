/**
 * Catalog faceted-filtering adapter.
 *
 * The storefront does not define which attributes are filterable — Shopify's
 * Search & Discovery app does. This module is the single boundary that:
 *   1. normalizes the API's `products.filters` into a UI-friendly `FacetGroup[]`,
 *   2. treats the URL as the source of truth for applied filters (each applied
 *      value is one `filter` search param holding its opaque `ProductFilter`
 *      JSON `input`), and
 *   3. converts applied filters back into either a `ProductFilter[]` (collection
 *      queries) or a search-query string (the root `products` connection, which
 *      has no `filters` argument).
 *
 * Because every applied value carries Shopify's own `input` blob, the same code
 * path works whether a facet is backed by a metafield, tag, product option,
 * vendor, price, etc. — the storefront stays agnostic to the data source.
 */

/** Mirrors the Storefront API `ProductFilter` input object (subset we use). */
export type ProductFilter = {
  available?: boolean;
  variantOption?: {name: string; value: string};
  productMetafield?: {namespace: string; key: string; value: string};
  variantMetafield?: {namespace: string; key: string; value: string};
  productType?: string;
  productVendor?: string;
  tag?: string;
  price?: {min?: number; max?: number};
};

/** Raw `Filter` shape returned by `products.filters` (and our tag fallback). */
export type ApiFilter = {
  id: string;
  label: string;
  type: string;
  values: Array<{
    id: string;
    label: string;
    count?: number | null;
    input: string | object;
  }>;
};

export type FacetValue = {
  id: string;
  label: string;
  count: number | null;
  /** Canonical JSON for the value's `ProductFilter` input. */
  input: string;
  selected: boolean;
};

export type FacetGroup = {
  id: string;
  label: string;
  type: string;
  values: FacetValue[];
};

/** URL search-param key holding one applied filter's `ProductFilter` JSON. */
export const FILTER_PARAM = 'filter';

/** Non-filter params we must preserve when rebuilding catalog URLs. */
const PRESERVED_PARAMS = new Set(['sort']);

/** Stable string form so URL values and API inputs compare reliably. */
function canonicalizeInput(input: string | object): string {
  try {
    const parsed = typeof input === 'string' ? JSON.parse(input) : input;
    return JSON.stringify(parsed);
  } catch {
    return typeof input === 'string' ? input : JSON.stringify(input);
  }
}

/**
 * Read applied filters from the URL.
 * Returns both the `ProductFilter[]` to send to GraphQL and a set of canonical
 * inputs used to mark facet values as selected.
 */
export function parseAppliedFilters(searchParams: URLSearchParams): {
  productFilters: ProductFilter[];
  appliedInputs: Set<string>;
} {
  const productFilters: ProductFilter[] = [];
  const appliedInputs = new Set<string>();

  for (const raw of searchParams.getAll(FILTER_PARAM)) {
    const canonical = canonicalizeInput(raw);
    if (appliedInputs.has(canonical)) continue;
    try {
      productFilters.push(JSON.parse(canonical) as ProductFilter);
      appliedInputs.add(canonical);
    } catch {
      // Skip malformed params instead of breaking the page.
    }
  }

  return {productFilters, appliedInputs};
}

/** Normalize API (or fallback) filters into the view model. */
export function normalizeFacets(
  apiFilters: ApiFilter[] | undefined | null,
  appliedInputs: Set<string>,
): FacetGroup[] {
  if (!apiFilters?.length) return [];

  return apiFilters
    .map((filter) => {
      const values = filter.values
        .map((value) => {
          const input = canonicalizeInput(value.input);
          const count = value.count ?? null;
          return {
            id: value.id,
            label: value.label,
            count,
            input,
            selected: appliedInputs.has(input),
          };
        })
        // Hide dead-end options (0 results) unless they're currently applied.
        .filter((value) => value.selected || value.count == null || value.count > 0);

      return {id: filter.id, label: filter.label, type: filter.type, values};
    })
    .filter((group) => group.values.length > 0);
}

/** Toggle one filter value on/off, preserving sort and other applied filters. */
export function buildToggledSearch(search: string, valueInput: string): string {
  const params = new URLSearchParams(search);
  const canonical = canonicalizeInput(valueInput);
  const existing = params.getAll(FILTER_PARAM);

  params.delete(FILTER_PARAM);
  let removed = false;
  for (const raw of existing) {
    if (canonicalizeInput(raw) === canonical) {
      removed = true;
      continue;
    }
    params.append(FILTER_PARAM, raw);
  }
  if (!removed) params.append(FILTER_PARAM, canonical);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/** Remove every applied filter, keeping sort (and any other preserved params). */
export function buildClearedSearch(search: string): string {
  const params = new URLSearchParams(search);
  for (const key of [...params.keys()]) {
    if (key === FILTER_PARAM || !PRESERVED_PARAMS.has(key)) {
      params.delete(key);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/** Set the sort param while keeping applied filters intact. */
export function buildSortedSearch(search: string, sort: string): string {
  const params = new URLSearchParams(search);
  params.set('sort', sort);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function countAppliedFilters(search: string): number {
  return new URLSearchParams(search).getAll(FILTER_PARAM).length;
}
