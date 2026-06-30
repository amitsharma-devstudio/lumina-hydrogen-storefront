import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import {CatalogFilterDrawer} from '~/components/catalog/CatalogFilterDrawer';
import {CatalogProductGrid} from '~/components/catalog/CatalogProductGrid';
import {CatalogFilterBar} from '~/components/catalog/CatalogFilterBar';
import {CatalogSortSelect} from '~/components/catalog/CatalogSortSelect';
import {Breadcrumbs} from '~/components/ui/Breadcrumbs';
import type {CatalogSortKey} from '~/lib/catalogSort';
import {
  buildClearedSearch,
  countAppliedFilters,
  type FacetGroup,
} from '~/lib/catalogFacets';
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
  facets?: FacetGroup[];
};

export function CollectionProductsPage({
  collection,
  sort,
  facets = [],
}: CollectionProductsPageProps) {
  const location = useLocation();
  const {pathname} = location;
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setFiltersOpen(false);
  }, [pathname, location.search]);

  // Live count of rendered products; grows as more pages load via pagination.
  const [productCount, setProductCount] = useState(
    collection.products.nodes.length,
  );
  const activeFilterCount = countAppliedFilters(location.search);
  const hasActiveFilters = activeFilterCount > 0;
  const hasFilterOptions = facets.length > 0;
  const breadcrumbs = [
    {label: 'Home', to: '/'},
    {label: 'Collections', to: '/collections'},
    {label: collection.title},
  ];

  return (
    <main className="catalog-plp bg-[var(--color-background)]">
      <div className="border-b border-[var(--color-home-border)] bg-[var(--color-home-muted)]">
        <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
            <div className="min-w-0">
              <Breadcrumbs items={breadcrumbs} />
              <h1 className="mt-4 text-4xl font-light text-neutral-950 md:text-5xl">
                {collection.title}
              </h1>
              {collection.description ? (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
                  {collection.description}
                </p>
              ) : null}
            </div>
            <CatalogSortSelect sort={sort} />
          </div>
        </div>
      </div>

      {hasFilterOptions ? (
        <CatalogFilterDrawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          facets={facets}
        />
      ) : null}

      <div className="mx-auto max-w-7xl px-6 pb-14 pt-6 lg:pt-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {hasFilterOptions ? (
            <aside className="hidden w-full shrink-0 lg:sticky lg:top-24 lg:block lg:w-52 xl:w-56">
              <CatalogFilterBar facets={facets} />
            </aside>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {productCount > 0 ? (
                <p className="text-sm text-neutral-500">
                  {collection.products.pageInfo.hasNextPage
                    ? `Showing ${productCount} products`
                    : `${productCount} ${productCount === 1 ? 'product' : 'products'}`}
                </p>
              ) : (
                <span />
              )}
              {hasFilterOptions ? (
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-primary hover:bg-primary-muted lg:hidden"
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
              <div className="rounded-xl border border-[var(--color-home-border)] bg-[var(--color-home-muted)] px-6 py-16 text-center">
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
                    to={`${pathname}${buildClearedSearch(location.search)}`}
                    className="mt-6 inline-flex min-h-12 items-center rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-primary hover:bg-primary-muted"
                  >
                    Clear filters
                  </Link>
                ) : null}
              </div>
            ) : (
              <CatalogProductGrid
                products={collection.products}
                onLoadedCount={setProductCount}
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
