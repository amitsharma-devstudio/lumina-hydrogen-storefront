import {Link, useLocation} from 'react-router';
import {
  CATALOG_FILTER_GROUPS,
  catalogFiltersQueryString,
  countActiveCatalogFilters,
  toggleCatalogFilter,
  type CatalogActiveFilters,
  type CatalogFilterOptions,
  type CatalogFilterParam,
} from '~/lib/catalogFilters';
import type {CatalogSortKey} from '~/lib/catalogSort';

export function CatalogFilterBar({
  activeFilters,
  filterOptions,
  sort,
  layout = 'sidebar',
}: {
  activeFilters: CatalogActiveFilters;
  filterOptions: CatalogFilterOptions;
  sort: CatalogSortKey;
  layout?: 'sidebar' | 'drawer';
}) {
  const {pathname} = useLocation();
  const activeCount = countActiveCatalogFilters(activeFilters);
  const hasAnyOptions = CATALOG_FILTER_GROUPS.some(
    ({param}) => (filterOptions[param]?.length ?? 0) > 0,
  );

  if (!hasAnyOptions) return null;

  const isDrawer = layout === 'drawer';

  return (
    <div role="region" aria-label="Product filters" className="text-left">
      <div className="mb-4 flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1 border-b border-neutral-200 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
          Filter
        </p>
        <Link
          to={`${pathname}${catalogFiltersQueryString({}, sort)}`}
          className={`text-xs text-neutral-600 underline-offset-2 hover:text-primary hover:underline ${
            activeCount > 0
              ? ''
              : 'pointer-events-none invisible'
          }`}
          tabIndex={activeCount > 0 ? 0 : -1}
          aria-hidden={activeCount === 0}
        >
          Clear all{activeCount > 0 ? ` (${activeCount})` : ''}
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {CATALOG_FILTER_GROUPS.map(({param, label}) => (
          <FilterGroup
            key={param}
            param={param}
            label={label}
            options={filterOptions[param] ?? []}
            activeFilters={activeFilters}
            sort={sort}
            pathname={pathname}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}

function FilterGroup({
  param,
  label,
  options,
  activeFilters,
  sort,
  pathname,
  layout,
}: {
  param: CatalogFilterParam;
  label: string;
  options: NonNullable<CatalogFilterOptions[CatalogFilterParam]>;
  activeFilters: CatalogActiveFilters;
  sort: CatalogSortKey;
  pathname: string;
  layout: 'sidebar' | 'drawer';
}) {
  if (options.length === 0) return null;

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2.5 text-xs font-medium text-neutral-800">
        {label}
      </legend>
      <ul
        className={
          layout === 'drawer'
            ? 'flex flex-col gap-1'
            : 'flex flex-col gap-1 lg:gap-1.5'
        }
      >
        {options.map((option) => {
          const isActive = activeFilters[param] === option.value;
          const next = toggleCatalogFilter(
            activeFilters,
            param,
            option.value,
          );
          const href = `${pathname}${catalogFiltersQueryString(next, sort)}`;

          return (
            <li key={option.tag}>
              <Link
                to={href}
                prefetch="intent"
                className={`catalog-filter-option ${isActive ? 'catalog-filter-option--active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="catalog-filter-radio" aria-hidden />
                <span className="catalog-filter-label">{option.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
