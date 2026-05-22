import {Form, Link, useLocation} from 'react-router';
import {Analytics, Image} from '@shopify/hydrogen';
import {CatalogProductGrid} from '~/components/catalog/CatalogProductGrid';
import {CatalogFilterBar} from '~/components/catalog/CatalogFilterBar';
import {
  CATALOG_SORT_OPTIONS,
  type CatalogSortKey,
} from '~/lib/catalogSort';
import type {
  CatalogActiveFilters,
  CatalogFilterOptions,
} from '~/lib/catalogFilters';
import {catalogFiltersQueryString} from '~/lib/catalogFilters';
import type {ProductCardProduct} from '~/components/product/productCard.types';

type CollectionProductsConnection = {
  nodes: ProductCardProduct[];
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
};

export type CollectionProductsPageData = {
  id: string;
  handle: string;
  title: string;
  description?: string | null;
  image?: {
    id?: string;
    url?: string | null;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  products: CollectionProductsConnection;
};

type CollectionProductsPageProps = {
  collection: CollectionProductsPageData;
  sort: CatalogSortKey;
  filters?: CatalogActiveFilters;
  filterOptions?: CatalogFilterOptions;
  /** Eyebrow above the title, e.g. "Collection" or "Shop" */
  eyebrow?: string;
  showHeroImage?: boolean;
};

export function CollectionProductsPage({
  collection,
  sort,
  filters = {},
  filterOptions = {},
  eyebrow = 'Collection',
  showHeroImage = true,
}: CollectionProductsPageProps) {
  const {pathname} = useLocation();
  const productCount = collection.products.nodes.length;
  const hasActiveFilters = Object.keys(filters).length > 0;
  return (
    <main className="catalog-plp bg-white">
      <div className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
                {eyebrow}
              </div>
              <h1 className="text-4xl font-light tracking-tight text-black md:text-5xl">
                {collection.title}
              </h1>
              {collection.description ? (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
                  {collection.description}
                </p>
              ) : null}
              {collection.handle === 'all' ? (
                <p className="mt-4 text-sm text-neutral-600">
                  <a
                    href="/collections"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Shop by collection
                  </a>{' '}
                  — New Arrivals, Serums, Bestseller, and more.
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-4 md:justify-end">
              <Form
                method="get"
                className="w-full md:w-auto"
                preventScrollReset
              >
                <label className="sr-only" htmlFor="sort">
                  Sort products
                </label>
                <div className="relative md:w-[260px]">
                  {Object.entries(filters).map(([key, value]) =>
                    value ? (
                      <input key={key} type="hidden" name={key} value={value} />
                    ) : null,
                  )}
                  <select
                    id="sort"
                    name="sort"
                    defaultValue={sort}
                    className="w-full appearance-none rounded-full border border-neutral-200 bg-white px-5 py-3 pr-12 text-sm text-black outline-none transition-colors hover:border-neutral-400 focus:border-neutral-400"
                    onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  >
                    {CATALOG_SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {showHeroImage && collection.image?.url ? (
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <div className="overflow-hidden rounded-2xl bg-neutral-50">
            <Image
              data={collection.image}
              alt={collection.image.altText || collection.title}
              className="h-[260px] w-full object-cover md:h-[340px]"
              sizes="(min-width: 45em) 1200px, 100vw"
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-6 pb-14 pt-6 lg:pt-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-52 xl:w-56">
            <CatalogFilterBar
              activeFilters={filters}
              filterOptions={filterOptions}
              sort={sort}
            />
          </aside>

          <div className="min-w-0 flex-1">
            {productCount > 0 ? (
              <p className="mb-5 text-sm text-neutral-500">
                {productCount} {productCount === 1 ? 'product' : 'products'}
              </p>
            ) : null}

            {productCount === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
                <p className="text-lg font-light text-neutral-900">
                  {hasActiveFilters
                    ? 'No products match these filters'
                    : 'No products available'}
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  {hasActiveFilters
                    ? 'Try removing a filter or browse the full catalog.'
                    : 'Publish products to the Online Store channel in Shopify Admin.'}
                </p>
                {hasActiveFilters ? (
                  <Link
                    to={`${pathname}${catalogFiltersQueryString({}, sort)}`}
                    className="mt-6 inline-flex rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm text-neutral-800 transition-colors hover:border-primary"
                  >
                    Clear filters
                  </Link>
                ) : null}
              </div>
            ) : (
              <CatalogProductGrid
                products={collection.products}
                autoLoadNext={{maxAutoLoads: 2}}
              />
            )}
          </div>
        </div>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </main>
  );
}
