import {Link} from 'react-router';
import {ProductsContent} from '~/components/home/ProductsContent';
import type {CollectionProductList} from '~/components/home/productsSection.types';

export function HomeBestsellers({products}: {products: CollectionProductList}) {
  return (
    <section className="bg-neutral-50 py-20" aria-labelledby="bestsellers">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-16">
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            BESTSELLERS
          </div>
          <h2
            id="bestsellers"
            className="text-4xl font-light tracking-tight text-black md:text-5xl"
          >
            Our Signature Collection
          </h2>
        </header>

        <ProductsContent
          products={products}
          emptyMessage="No bestsellers yet. Add products to the “bestsellers” collection in Shopify Admin."
        />

        <div className="mt-10">
          <Link
            to="/collections/bestsellers"
            prefetch="intent"
            className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm text-black transition-colors hover:border-black"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
}
