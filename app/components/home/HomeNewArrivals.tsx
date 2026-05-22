import {Link} from 'react-router';
import {ProductsContent} from '~/components/home/ProductsContent';
import type {CollectionProductList} from '~/components/home/productsSection.types';

export function HomeNewArrivals({products}: {products: CollectionProductList}) {
  return (
    <section className="bg-white py-20" aria-labelledby="new-arrivals">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-16">
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            NEW ARRIVALS
          </div>
          <h2
            id="new-arrivals"
            className="text-4xl font-light tracking-tight text-black md:text-5xl"
          >
            Freshly Added
          </h2>
        </header>

        <ProductsContent
          products={products}
          emptyMessage="No new arrivals yet. Add products to the “new-arrivals” collection in Shopify Admin."
        />

        <div className="mt-10">
          <Link
            to="/collections/new-arrivals"
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
