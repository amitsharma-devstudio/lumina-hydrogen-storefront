import type {BestsellersProductsQuery} from 'storefrontapi.generated';

/** Shared shape for collection product grid queries on the homepage. */
export type CollectionProductsQuery = BestsellersProductsQuery;

export type CollectionProductNode = NonNullable<
  CollectionProductsQuery['collection']
>['products']['nodes'][number];

/** Resolved product list for critical (awaited) homepage sections. */
export type CollectionProductList = CollectionProductNode[];

export function getCollectionProductNodes(
  response: CollectionProductsQuery | null | undefined,
): CollectionProductList {
  return response?.collection?.products?.nodes ?? [];
}
