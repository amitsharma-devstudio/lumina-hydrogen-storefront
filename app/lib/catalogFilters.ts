/** URL param keys → Shopify product tag prefixes (e.g. skin:normal). */
export const CATALOG_FILTER_GROUPS = [
  {param: 'skin', prefix: 'skin:', label: 'Skin type'},
  {param: 'concern', prefix: 'concern:', label: 'Concern'},
  {param: 'badge', prefix: 'badge:', label: 'Badge'},
  {param: 'active', prefix: 'active:', label: 'Active'},
] as const;

export type CatalogFilterParam = (typeof CATALOG_FILTER_GROUPS)[number]['param'];

export type CatalogActiveFilters = Partial<
  Record<CatalogFilterParam, string>
>;

export type CatalogFilterOption = {
  value: string;
  label: string;
  tag: string;
};

export type CatalogFilterOptions = Partial<
  Record<CatalogFilterParam, CatalogFilterOption[]>
>;

function formatFilterLabel(value: string): string {
  return value
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function tagForFilter(
  param: CatalogFilterParam,
  value: string,
): string {
  const group = CATALOG_FILTER_GROUPS.find((g) => g.param === param);
  return `${group?.prefix ?? ''}${value}`;
}

export function parseCatalogFiltersFromRequest(
  request: Request,
): CatalogActiveFilters {
  const params = new URL(request.url).searchParams;
  const active: CatalogActiveFilters = {};

  for (const {param} of CATALOG_FILTER_GROUPS) {
    const value = params.get(param)?.trim();
    if (value) active[param] = value;
  }

  return active;
}

export function buildShopifyProductFilters(
  active: CatalogActiveFilters,
): Array<{tag: string}> {
  return CATALOG_FILTER_GROUPS.flatMap(({param}) => {
    const value = active[param];
    if (!value) return [];
    return [{tag: tagForFilter(param, value)}];
  });
}

/** Search query for root `products` when not using a collection. */
export function buildShopifyProductsSearchQuery(
  active: CatalogActiveFilters,
): string | undefined {
  const parts = CATALOG_FILTER_GROUPS.flatMap(({param}) => {
    const value = active[param];
    if (!value) return [];
    return [`tag:${tagForFilter(param, value)}`];
  });

  return parts.length > 0 ? parts.join(' AND ') : undefined;
}

export function buildFilterOptionsFromTags(
  tags: string[],
): CatalogFilterOptions {
  const options: CatalogFilterOptions = {};

  for (const {param, prefix, label} of CATALOG_FILTER_GROUPS) {
    const seen = new Set<string>();
    const groupOptions: CatalogFilterOption[] = [];

    for (const tag of tags) {
      if (!tag.startsWith(prefix)) continue;
      const value = tag.slice(prefix.length);
      if (!value || seen.has(value)) continue;
      seen.add(value);
      groupOptions.push({
        value,
        label: formatFilterLabel(value),
        tag,
      });
    }

    if (groupOptions.length > 0) {
      options[param] = groupOptions.sort((a, b) =>
        a.label.localeCompare(b.label),
      );
    }
  }

  return options;
}

export function toggleCatalogFilter(
  active: CatalogActiveFilters,
  param: CatalogFilterParam,
  value: string,
): CatalogActiveFilters {
  const next = {...active};
  if (next[param] === value) {
    delete next[param];
  } else {
    next[param] = value;
  }
  return next;
}

export function buildCatalogSearchParams(
  active: CatalogActiveFilters,
  sort?: string,
): URLSearchParams {
  const params = new URLSearchParams();
  if (sort) params.set('sort', sort);

  for (const {param} of CATALOG_FILTER_GROUPS) {
    const value = active[param];
    if (value) params.set(param, value);
  }

  return params;
}

export function catalogFiltersQueryString(
  active: CatalogActiveFilters,
  sort?: string,
): string {
  const qs = buildCatalogSearchParams(active, sort).toString();
  return qs ? `?${qs}` : '';
}

export function countActiveCatalogFilters(active: CatalogActiveFilters): number {
  return CATALOG_FILTER_GROUPS.filter(({param}) => Boolean(active[param]))
    .length;
}
