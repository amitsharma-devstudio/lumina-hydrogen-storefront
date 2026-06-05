import {ProductCard} from '~/components/product/ProductCard';
import type {ProductCardProduct} from '~/components/product/productCard.types';

/**
 * Collection PLP card — thin alias so catalog code never imports homepage cards.
 * Implementation: `~/components/product/ProductCard` (carousel variant `catalog`).
 */
export function CatalogProductCard({
  product,
  productUrl,
}: {
  product: ProductCardProduct;
  productUrl?: string;
}) {
  return <ProductCard product={product} productUrl={productUrl} />;
}
