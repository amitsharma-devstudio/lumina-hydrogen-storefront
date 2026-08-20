import {Suspense} from 'react';
import {Await} from 'react-router';
import {Link} from '~/components/Link';
import {
  HOME_BTN_SECONDARY,
  HOME_SECTION_HEADER,
  HOME_SECTION_EYEBROW,
  HOME_SECTION_LEDE,
  HOME_SECTION_MUTED,
  HOME_SECTION_TITLE,
} from '~/components/home/homeSectionStyles';
import {ProductsContent} from '~/components/home/ProductsContent';
import type {CollectionProductList} from '~/components/home/productsSection.types';
import {ProductGridSkeleton} from '~/components/ui/Skeleton';
import {BESTSELLERS_COLLECTION_PATH} from '~/lib/storeCollections';

export function HomeBestsellers({
  products,
}: {
  products: Promise<CollectionProductList>;
}) {
  return (
    <section className={HOME_SECTION_MUTED} aria-labelledby="bestsellers">
      <div className="mx-auto max-w-7xl px-6">
        <header className={HOME_SECTION_HEADER}>
          <div>
            <p className={HOME_SECTION_EYEBROW}>Bestsellers</p>
            <h2 id="bestsellers" className={HOME_SECTION_TITLE}>
              Proven formulas people come back for
            </h2>
          </div>
          <p className={HOME_SECTION_LEDE}>
            Start with the products customers use until the last drop: barrier
            support, active-led treatments, and daily hydration that layer
            beautifully.
          </p>
        </header>

        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <Await resolve={products}>
            {(resolved) => (
              <ProductsContent
                products={resolved}
                ariaLabel="Bestsellers"
                emptyMessage="No bestsellers yet. Add products to the “bestsellers” collection in Shopify Admin."
              />
            )}
          </Await>
        </Suspense>

        <div className="mt-10">
          <Link
            to={BESTSELLERS_COLLECTION_PATH}
            prefetch="intent"
            className={HOME_BTN_SECONDARY}
          >
            Shop all bestsellers
          </Link>
        </div>
      </div>
    </section>
  );
}
