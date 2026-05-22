export type CatalogSortKey =
  | 'FEATURED'
  | 'BEST_SELLING'
  | 'NEWEST'
  | 'PRICE_ASC'
  | 'PRICE_DESC';

export const CATALOG_SORT_OPTIONS: Array<{value: CatalogSortKey; label: string}> =
  [
    {value: 'FEATURED', label: 'Featured'},
    {value: 'BEST_SELLING', label: 'Best selling'},
    {value: 'NEWEST', label: 'Newest'},
    {value: 'PRICE_ASC', label: 'Price: low to high'},
    {value: 'PRICE_DESC', label: 'Price: high to low'},
  ];

export function getCatalogSortFromRequest(
  request: Request,
): CatalogSortKey {
  const sort = new URL(request.url).searchParams.get('sort');
  if (
    sort === 'BEST_SELLING' ||
    sort === 'NEWEST' ||
    sort === 'PRICE_ASC' ||
    sort === 'PRICE_DESC'
  ) {
    return sort;
  }
  return 'FEATURED';
}

/** Sort vars for `collection.products` (ProductCollectionSortKeys). */
export function getCatalogSortVariables(sort: CatalogSortKey): {
  sortKey?: string;
  reverse?: boolean;
} {
  switch (sort) {
    case 'BEST_SELLING':
      return {sortKey: 'BEST_SELLING', reverse: false};
    case 'NEWEST':
      return {sortKey: 'CREATED', reverse: true};
    case 'PRICE_ASC':
      return {sortKey: 'PRICE', reverse: false};
    case 'PRICE_DESC':
      return {sortKey: 'PRICE', reverse: true};
    default:
      return {};
  }
}

/** Sort vars for root `products` query (ProductSortKeys). */
export function getProductCatalogSortVariables(sort: CatalogSortKey): {
  sortKey: string;
  reverse: boolean;
} {
  switch (sort) {
    case 'BEST_SELLING':
      return {sortKey: 'BEST_SELLING', reverse: false};
    case 'NEWEST':
      return {sortKey: 'CREATED_AT', reverse: true};
    case 'PRICE_ASC':
      return {sortKey: 'PRICE', reverse: false};
    case 'PRICE_DESC':
      return {sortKey: 'PRICE', reverse: true};
    default:
      return {sortKey: 'CREATED_AT', reverse: true};
  }
}
