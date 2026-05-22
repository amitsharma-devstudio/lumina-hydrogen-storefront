import {EmptyProductsState} from '~/components/home/EmptyProductsState';
import {ProductsGrid} from '~/components/home/ProductsGrid';
import type {CollectionProductList} from '~/components/home/productsSection.types';

/**
 * Resolved-state body for critical homepage product sections (no Suspense).
 */
export function ProductsContent({
  products,
  emptyMessage,
}: {
  products: CollectionProductList;
  emptyMessage: string;
}) {
  if (products.length === 0) {
    return <EmptyProductsState message={emptyMessage} />;
  }

  return <ProductsGrid products={products} />;
}
