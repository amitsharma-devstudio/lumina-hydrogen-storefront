import {Link} from 'react-router';
import {BESTSELLERS_COLLECTION_PATH} from '~/lib/storeCollections';
import {ProductsContent} from '~/components/home/ProductsContent';
import type {CollectionProductList} from '~/components/home/productsSection.types';

export function HomeBestsellers({products}: {products: CollectionProductList}) {
  return (
    <section className="bg-[#f6f3ef] py-20" aria-labelledby="bestsellers">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-14 grid gap-6 md:grid-cols-[1fr_0.75fr] md:items-end">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.15em] text-primary">
              BESTSELLERS
            </div>
            <h2
              id="bestsellers"
              className="max-w-2xl text-4xl font-light text-black md:text-5xl"
            >
              Proven formulas people come back for
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-neutral-600 md:justify-self-end">
            Start with the products customers use until the last drop: barrier
            support, active-led treatments, and daily hydration that layer
            beautifully.
          </p>
        </header>

        <ProductsContent
          products={products}
          emptyMessage="No bestsellers yet. Add products to the “bestsellers” collection in Shopify Admin."
        />

        <div className="mt-10">
          <Link
            to={BESTSELLERS_COLLECTION_PATH}
            prefetch="intent"
            className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Shop all bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}
