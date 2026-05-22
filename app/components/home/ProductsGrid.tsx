import {HomeProductCard} from '~/components/home/HomeProductCard';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import type {CollectionProductNode} from '~/components/home/productsSection.types';

export function ProductsGrid({products}: {products: CollectionProductNode[]}) {
  return (
    <div className={PRODUCT_GRID_CLASSNAME}>
      {products.map((product) => (
        <HomeProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
