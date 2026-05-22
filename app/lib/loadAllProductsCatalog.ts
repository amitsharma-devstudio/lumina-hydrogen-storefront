import {getPaginationVariables} from '@shopify/hydrogen';
import type {Storefront} from '@shopify/hydrogen';
import type {CollectionProductsPageData} from '~/components/catalog/CollectionProductsPage';
import {CatalogProductsQuery} from '~/graphql/queries/CatalogProductsQuery';
import {CatalogFilterFacetsQuery} from '~/graphql/queries/CollectionFilterFacetsQuery';
import {CollectionProductsQuery} from '~/graphql/queries/CollectionProductsQuery';
import {
  buildFilterOptionsFromTags,
  buildShopifyProductsSearchQuery,
  parseCatalogFiltersFromRequest,
} from '~/lib/catalogFilters';
import {
  getCatalogSortFromRequest,
  getProductCatalogSortVariables,
} from '~/lib/catalogSort';

const ALL_PRODUCTS_COLLECTION_HANDLE = 'all';

const FALLBACK_CATALOG_META: Pick<
  CollectionProductsPageData,
  'id' | 'handle' | 'title' | 'description' | 'image'
> = {
  id: 'gid://lumina/Catalog/all-products',
  handle: 'all',
  title: 'Shop All',
  description: 'Browse our full range of skincare.',
  image: null,
};

type LoadAllProductsCatalogArgs = {
  storefront: Storefront;
  request: Request;
  pageBy?: number;
};

async function loadCatalogFilterOptions(storefront: Storefront) {
  const {products} = await storefront.query(CatalogFilterFacetsQuery);
  const tags = products?.nodes?.flatMap((node) => node.tags ?? []) ?? [];
  return buildFilterOptionsFromTags(tags);
}

/** Optional Shopify `all` collection — used for title/description only. */
async function loadAllCollectionMeta(storefront: Storefront) {
  const {collection} = await storefront.query(CollectionProductsQuery, {
    variables: {handle: ALL_PRODUCTS_COLLECTION_HANDLE, first: 1},
  });
  return collection;
}

/**
 * Full-store catalog at `/collections/all`.
 * Always loads via the `products` connection so every published product appears
 * (the Shopify `all` collection is often empty on custom/dev stores).
 */
export async function loadAllProductsCatalog({
  storefront,
  request,
  pageBy = 12,
}: LoadAllProductsCatalogArgs) {
  const paginationVariables = getPaginationVariables(request, {pageBy});
  const sort = getCatalogSortFromRequest(request);
  const sortVars = getProductCatalogSortVariables(sort);
  const filters = parseCatalogFiltersFromRequest(request);
  const searchQuery = buildShopifyProductsSearchQuery(filters);

  const [{products}, filterOptions, allCollectionMeta] = await Promise.all([
    storefront.query(CatalogProductsQuery, {
      variables: {
        ...paginationVariables,
        ...sortVars,
        query: searchQuery,
      },
    }),
    loadCatalogFilterOptions(storefront),
    loadAllCollectionMeta(storefront),
  ]);

  if (!products) {
    return {collection: null, sort, filters, filterOptions};
  }

  return {
    collection: {
      id: allCollectionMeta?.id ?? FALLBACK_CATALOG_META.id,
      handle: 'all',
      title: allCollectionMeta?.title ?? FALLBACK_CATALOG_META.title,
      description:
        allCollectionMeta?.description ?? FALLBACK_CATALOG_META.description,
      image: allCollectionMeta?.image ?? null,
      products,
    },
    sort,
    filters,
    filterOptions,
  };
}
