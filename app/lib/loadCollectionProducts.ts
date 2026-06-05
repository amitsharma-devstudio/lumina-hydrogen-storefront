import {getPaginationVariables} from '@shopify/hydrogen';
import type {Storefront} from '@shopify/hydrogen';
import {CollectionProductsQuery} from '~/graphql/queries/CollectionProductsQuery';
import {CatalogFilterFacetsQuery} from '~/graphql/queries/CollectionFilterFacetsQuery';
import {
  buildFilterOptionsFromTags,
  buildShopifyProductFilters,
  parseCatalogFiltersFromRequest,
  type CatalogActiveFilters,
  type CatalogFilterOptions,
} from '~/lib/catalogFilters';
import {
  getCatalogSortFromRequest,
  getCatalogSortVariables,
} from '~/lib/catalogSort';

type LoadCollectionProductsArgs = {
  storefront: Storefront;
  request: Request;
  handle: string;
  pageBy?: number;
};

/** Same facet source as `/collections/all` so every PLP shares filter UI. */
export async function loadCatalogFilterOptions(
  storefront: Storefront,
): Promise<CatalogFilterOptions> {
  const {products} = await storefront.query(CatalogFilterFacetsQuery);
  const tags = products?.nodes?.flatMap((node) => node.tags ?? []) ?? [];
  return buildFilterOptionsFromTags(tags);
}

export async function loadCollectionProducts({
  storefront,
  request,
  handle,
  pageBy = 12,
}: LoadCollectionProductsArgs) {
  const paginationVariables = getPaginationVariables(request, {pageBy});
  const sort = getCatalogSortFromRequest(request);
  const sortVars = getCatalogSortVariables(sort);
  const filters: CatalogActiveFilters = parseCatalogFiltersFromRequest(request);
  const productFilters = buildShopifyProductFilters(filters);

  const [{collection}, filterOptions] = await Promise.all([
    storefront.query(CollectionProductsQuery, {
      variables: {
        handle,
        ...paginationVariables,
        ...sortVars,
        filters: productFilters.length > 0 ? productFilters : undefined,
      },
    }),
    loadCatalogFilterOptions(storefront),
  ]);

  return {collection, sort, filters, filterOptions};
}
