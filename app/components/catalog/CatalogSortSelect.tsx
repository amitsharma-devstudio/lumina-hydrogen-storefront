import {useNavigate, useLocation} from 'react-router';
import {ThemedDropdown} from '~/components/ui/ThemedDropdown';
import {catalogFiltersQueryString} from '~/lib/catalogFilters';
import {
  CATALOG_SORT_OPTIONS,
  type CatalogSortKey,
} from '~/lib/catalogSort';
import type {CatalogActiveFilters} from '~/lib/catalogFilters';

export function CatalogSortSelect({
  sort,
  filters,
  className = 'w-full md:w-[260px]',
}: {
  sort: CatalogSortKey;
  filters: CatalogActiveFilters;
  className?: string;
}) {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  return (
    <ThemedDropdown
      label="Sort products"
      value={sort}
      options={CATALOG_SORT_OPTIONS}
      className={className}
      onChange={(next) => {
        navigate(
          `${pathname}${catalogFiltersQueryString(filters, next as CatalogSortKey)}`,
          {preventScrollReset: true},
        );
      }}
    />
  );
}
