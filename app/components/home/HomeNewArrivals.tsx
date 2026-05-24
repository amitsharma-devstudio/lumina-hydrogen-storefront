import {Link} from 'react-router';
import {ProductsContent} from '~/components/home/ProductsContent';
import type {CollectionProductList} from '~/components/home/productsSection.types';

export function HomeNewArrivals({products}: {products: CollectionProductList}) {
  return (
    <section className="bg-white py-20" aria-labelledby="new-arrivals">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-14 grid gap-6 md:grid-cols-[1fr_0.75fr] md:items-end">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.15em] text-primary">
              NEW ARRIVALS
            </div>
            <h2
              id="new-arrivals"
              className="max-w-2xl text-4xl font-light text-black md:text-5xl"
            >
              The latest additions to your shelf
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-neutral-600 md:justify-self-end">
            New launches are selected for real routine roles: prep, treat, seal,
            and reset without overcrowding your bathroom counter.
          </p>
        </header>

        <ProductsContent
          products={products}
          emptyMessage="No new arrivals yet. Add products to the “new-arrivals” collection in Shopify Admin."
        />

        <div className="mt-10">
          <Link
            to="/collections/new-arrivals"
            prefetch="intent"
            className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Explore new arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
