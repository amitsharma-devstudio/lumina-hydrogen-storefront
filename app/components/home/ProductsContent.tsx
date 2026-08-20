import {EmptyProductsState} from '~/components/home/EmptyProductsState';
import {HomeProductCard} from '~/components/home/HomeProductCard';
import {HomeSectionCarousel} from '~/components/home/HomeSectionCarousel';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import type {CollectionProductList} from '~/components/home/productsSection.types';

/**
 * Resolved-state body for homepage product sections (used inside Suspense/Await).
 * Mobile: carousel with dots. Desktop: product grid.
 */
export function ProductsContent({
  products,
  emptyMessage,
  ariaLabel = 'Products',
}: {
  products: CollectionProductList;
  emptyMessage: string;
  ariaLabel?: string;
}) {
  if (products.length === 0) {
    return <EmptyProductsState message={emptyMessage} />;
  }

  return (
    <HomeSectionCarousel
      items={products}
      getKey={(product) => product.id}
      ariaLabel={ariaLabel}
      desktopClassName={PRODUCT_GRID_CLASSNAME}
      renderItem={(product) => <HomeProductCard product={product} />}
    />
  );
}
