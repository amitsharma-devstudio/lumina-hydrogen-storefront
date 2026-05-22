import {ProductsGrid} from '~/components/home/ProductsGrid';
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
        className="mb-8 text-4xl font-light tracking-tight text-black md:text-5xl"
      >
        You May Also Like
      </h2>
      <ProductsGrid products={products} />
    </section>
  );
}
