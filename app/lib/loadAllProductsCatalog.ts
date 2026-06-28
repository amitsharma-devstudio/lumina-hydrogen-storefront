import {getPaginationVariables} from '@shopify/hydrogen';
import type {Storefront} from '@shopify/hydrogen';
import type {CollectionProductsPageData} from '~/components/catalog/CollectionProductsPage';
import {CatalogProductsQuery} from '~/graphql/queries/CatalogProductsQuery';
import {CollectionProductsQuery} from '~/graphql/queries/CollectionProductsQuery';
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
  title: 'Shop all',
  description: null,
  image: null,
};

type LoadAllProductsCatalogArgs = {
  storefront: Storefront;
  request: Request;
  pageBy?: number;
};

/** Optional Shopify `all` collection — used for title/description only. */
async function loadAllCollectionMeta(storefront: Storefront) {
  const {collection} = await storefront.query(CollectionProductsQuery, {
    variables: {handle: ALL_PRODUCTS_COLLECTION_HANDLE, first: 1},
  });
  return collection;
}

/**
 * Full-store catalog at `/collections/all`.
 *
 * Loads via the root `products` connection so every published product appears
 * (this store has no virtual `all` collection). That connection has no
 * `filters` argument and native faceting is collection-scoped, so this page is
 * intentionally unfiltered — sort + pagination only. Faceted filtering lives on
 * the named collection PLPs.
 */
export async function loadAllProductsCatalog({
  storefront,
  request,
  pageBy = 12,
}: LoadAllProductsCatalogArgs) {
  const paginationVariables = getPaginationVariables(request, {pageBy});
  const sort = getCatalogSortFromRequest(request);
  const sortVars = getProductCatalogSortVariables(sort);

  const [{products}, allCollectionMeta] = await Promise.all([
    storefront.query(CatalogProductsQuery, {
      variables: {
        ...paginationVariables,
        ...sortVars,
      },
    }),
    loadAllCollectionMeta(storefront),
  ]);

  if (!products) {
    return {collection: null, sort, facets: []};
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
    facets: [],
  };
}
