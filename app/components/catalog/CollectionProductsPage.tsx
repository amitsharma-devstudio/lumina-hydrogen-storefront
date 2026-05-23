import {useEffect, useState} from 'react';
import {Form, Link, useLocation} from 'react-router';
import {Analytics, Image} from '@shopify/hydrogen';
import {CatalogFilterDrawer} from '~/components/catalog/CatalogFilterDrawer';
import {CatalogProductGrid} from '~/components/catalog/CatalogProductGrid';
import {CatalogFilterBar} from '~/components/catalog/CatalogFilterBar';
import {Breadcrumbs} from '~/components/ui/Breadcrumbs';
import {
  CATALOG_SORT_OPTIONS,
  type CatalogSortKey,
} from '~/lib/catalogSort';
import {
  catalogFiltersQueryString,
  countActiveCatalogFilters,
  type CatalogActiveFilters,
  type CatalogFilterOptions,
} from '~/lib/catalogFilters';
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
  showHeroImage?: boolean;
};

export function CollectionProductsPage({
  collection,
  sort,
  filters = {},
  filterOptions = {},
  showHeroImage = true,
}: CollectionProductsPageProps) {
  const location = useLocation();
  const {pathname} = location;
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setFiltersOpen(false);
  }, [pathname, location.search]);
  const productCount = collection.products.nodes.length;
  const hasActiveFilters = Object.keys(filters).length > 0;
  const activeFilterCount = countActiveCatalogFilters(filters);
  const isShopAll = collection.handle === 'all';
  const hasFilterOptions = Object.values(filterOptions).some(
    (opts) => (opts?.length ?? 0) > 0,
  );

  const breadcrumbs = isShopAll
    ? [
        {label: 'Home', to: '/'},
        {label: 'Collections', to: '/collections'},
        {label: 'Shop all'},
      ]
    : [
        {label: 'Home', to: '/'},
        {label: 'Collections', to: '/collections'},
        {label: collection.title},
      ];

  const sortControl = (
    <Form method="get" className="w-full md:w-auto" preventScrollReset>
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
  );

  return (
    <main className="catalog-plp bg-white">
      <div className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">
          <div
            className={
              isShopAll
                ? 'flex flex-col gap-6 md:flex-row md:items-center md:justify-between'
                : 'flex flex-col gap-8 md:flex-row md:items-end md:justify-between'
            }
          >
            <div className="min-w-0">
              <Breadcrumbs items={breadcrumbs} />
              {!isShopAll ? (
                <>
                  <h1 className="mt-4 text-4xl font-light tracking-tight text-black md:text-5xl">
                    {collection.title}
                  </h1>
                  {collection.description ? (
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
                      {collection.description}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>
            <div className="shrink-0 md:w-[260px]">{sortControl}</div>
          </div>
        </div>
      </div>

      {showHeroImage && !isShopAll && collection.image?.url ? (
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

      {hasFilterOptions ? (
        <CatalogFilterDrawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          activeFilters={filters}
          filterOptions={filterOptions}
          sort={sort}
        />
      ) : null}

      <div className="mx-auto max-w-7xl px-6 pb-14 pt-6 lg:pt-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {hasFilterOptions ? (
            <aside className="hidden w-full shrink-0 lg:sticky lg:top-24 lg:block lg:w-52 xl:w-56">
              <CatalogFilterBar
                activeFilters={filters}
                filterOptions={filterOptions}
                sort={sort}
              />
            </aside>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {productCount > 0 ? (
                <p className="text-sm text-neutral-500">
                  {productCount} {productCount === 1 ? 'product' : 'products'}
                </p>
              ) : (
                <span />
              )}
              {hasFilterOptions ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-primary lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                  aria-expanded={filtersOpen}
                >
                  <svg
                    className="h-4 w-4 text-neutral-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      d="M4 6h16M7 12h10M10 18h4"
                    />
                  </svg>
                  Filters
                  {activeFilterCount > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>
              ) : null}
            </div>

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
