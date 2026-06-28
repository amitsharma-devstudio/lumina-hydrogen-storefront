import {getPaginationVariables} from '@shopify/hydrogen';
import type {Storefront} from '@shopify/hydrogen';
import {CollectionProductsQuery} from '~/graphql/queries/CollectionProductsQuery';
import {
  normalizeFacets,
  parseAppliedFilters,
  type ApiFilter,
} from '~/lib/catalogFacets';
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

export async function loadCollectionProducts({
  storefront,
  request,
  handle,
  pageBy = 12,
}: LoadCollectionProductsArgs) {
  const url = new URL(request.url);
  const sort = getCatalogSortFromRequest(request);
  const sortVars = getCatalogSortVariables(sort);
  const paginationVariables = getPaginationVariables(request, {pageBy});
  const {productFilters, appliedInputs} = parseAppliedFilters(url.searchParams);

  const {collection} = await storefront.query(CollectionProductsQuery, {
    variables: {
      handle,
      ...paginationVariables,
      ...sortVars,
      filters: productFilters.length > 0 ? productFilters : undefined,
    },
  });

  if (!collection) {
    return {collection: null, sort, facets: []};
  }
  // Native, merchant-configured facets from Search & Discovery (with counts).
  const nativeFilters = collection.products?.filters as ApiFilter[] | undefined;
  const facets = normalizeFacets(nativeFilters, appliedInputs);
  return {collection, sort, facets};
}
