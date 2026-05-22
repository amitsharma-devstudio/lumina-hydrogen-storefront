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
}: {
  activeFilters: CatalogActiveFilters;
  filterOptions: CatalogFilterOptions;
  sort: CatalogSortKey;
}) {
  const {pathname} = useLocation();
  const activeCount = countActiveCatalogFilters(activeFilters);
  const hasAnyOptions = CATALOG_FILTER_GROUPS.some(
    ({param}) => (filterOptions[param]?.length ?? 0) > 0,
  );

  if (!hasAnyOptions) return null;

  return (
    <div role="region" aria-label="Product filters" className="text-left">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 lg:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
          Filter
        </p>
        {activeCount > 0 ? (
          <Link
            to={`${pathname}${catalogFiltersQueryString({}, sort)}`}
            className="shrink-0 text-xs text-neutral-600 underline-offset-2 hover:text-primary hover:underline"
          >
            Clear ({activeCount})
          </Link>
        ) : null}
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
}: {
  param: CatalogFilterParam;
  label: string;
  options: NonNullable<CatalogFilterOptions[CatalogFilterParam]>;
  activeFilters: CatalogActiveFilters;
  sort: CatalogSortKey;
  pathname: string;
}) {
  if (options.length === 0) return null;

  return (
    <div>
      <p className="mb-2.5 text-xs font-medium text-neutral-800">{label}</p>
      <ul className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
        {options.map((option) => {
          const isActive = activeFilters[param] === option.value;
          const next = toggleCatalogFilter(
            activeFilters,
            param,
            option.value,
          );
          const href = `${pathname}${catalogFiltersQueryString(next, sort)}`;

          return (
            <li key={option.tag} className="lg:w-full">
              <Link
                to={href}
                prefetch="intent"
                className={`inline-flex w-full justify-center rounded-full border px-4 py-2 text-xs font-medium transition-colors lg:justify-start ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary hover:text-primary'
                }`}
                aria-pressed={isActive}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
