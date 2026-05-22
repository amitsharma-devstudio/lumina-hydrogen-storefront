import {ProductCard} from '~/components/product/ProductCard';
import type {ProductCardProduct} from '~/components/product/productCard.types';
import type {CollectionProductNode} from '~/components/home/productsSection.types';

/** @deprecated Use ProductCard from ~/components/product/ProductCard */
export function HomeProductCard({product}: {product: CollectionProductNode}) {
  return <ProductCard product={product as ProductCardProduct} />;
}
