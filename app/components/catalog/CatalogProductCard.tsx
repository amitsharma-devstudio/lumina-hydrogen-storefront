import {ProductCard} from '~/components/product/ProductCard';
import type {ProductCardProduct} from '~/components/product/productCard.types';

/**
 * Collection PLP card — thin alias so catalog code never imports homepage cards.
 * Implementation: `~/components/product/ProductCard` (carousel variant `catalog`).
 */
export function CatalogProductCard({
  product,
  productUrl,
  loading = 'lazy',
  fetchPriority = 'auto',
}: {
  product: ProductCardProduct;
  productUrl?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  return (
    <ProductCard
      product={product}
      productUrl={productUrl}
      loading={loading}
      fetchPriority={fetchPriority}
    />
  );
}
