import {HomeProductCard} from '~/components/home/HomeProductCard';
import {HomeSectionCarousel} from '~/components/home/HomeSectionCarousel';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import type {CollectionProductList} from '~/components/home/productsSection.types';

export function ProductRecommendations({
  products,
}: {
  products: CollectionProductList;
}) {
  if (!products.length) return null;

  return (
    <section className="mt-20" aria-labelledby="product-recommendations">
      <h2
        id="product-recommendations"
        className="mb-8 text-3xl font-light tracking-tight text-black md:text-5xl"
      >
        You May Also Like
      </h2>
      <HomeSectionCarousel
        items={products}
        getKey={(product) => product.id}
        ariaLabel="Recommended products"
        desktopClassName={PRODUCT_GRID_CLASSNAME}
        renderItem={(product) => <HomeProductCard product={product} />}
      />
    </section>
  );
}
