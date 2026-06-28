import {Link, useLocation} from 'react-router';
import {
  buildClearedSearch,
  buildToggledSearch,
  countAppliedFilters,
  type FacetGroup,
} from '~/lib/catalogFacets';

export function CatalogFilterBar({
  facets,
  layout = 'sidebar',
}: {
  facets: FacetGroup[];
  layout?: 'sidebar' | 'drawer';
}) {
  const {pathname, search} = useLocation();
  const activeCount = countAppliedFilters(search);

  if (facets.length === 0) return null;

  return (
    <div role="region" aria-label="Product filters" className="text-left">
      <div className="mb-4 flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1 border-b border-neutral-200 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
          Filter
        </p>
        <Link
          to={`${pathname}${buildClearedSearch(search)}`}
          className={`text-xs text-neutral-600 underline-offset-2 hover:text-primary hover:underline ${
            activeCount > 0 ? '' : 'pointer-events-none invisible'
          }`}
          tabIndex={activeCount > 0 ? 0 : -1}
          aria-hidden={activeCount === 0}
        >
          Clear all{activeCount > 0 ? ` (${activeCount})` : ''}
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {facets.map((group) => (
          <FilterGroup
            key={group.id}
            group={group}
            pathname={pathname}
            search={search}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}

function FilterGroup({
  group,
  pathname,
  search,
  layout,
}: {
  group: FacetGroup;
  pathname: string;
  search: string;
  layout: 'sidebar' | 'drawer';
}) {
  if (group.values.length === 0) return null;

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2.5 text-xs font-medium text-neutral-800">
        {group.label}
      </legend>
      <ul
        className={
          layout === 'drawer'
            ? 'flex flex-col gap-1'
            : 'flex flex-col gap-1 lg:gap-1.5'
        }
      >
        {group.values.map((value) => {
          const href = `${pathname}${buildToggledSearch(search, value.input)}`;

          return (
            <li key={value.id}>
              <Link
                to={href}
                prefetch="intent"
                replace
                preventScrollReset
                className={`catalog-filter-option ${value.selected ? 'catalog-filter-option--active' : ''}`}
                aria-current={value.selected ? 'true' : undefined}
              >
                <span className="catalog-filter-radio" aria-hidden />
                <span className="catalog-filter-label">{value.label}</span>
                {value.count != null ? (
                  <span className="catalog-filter-count">{value.count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
