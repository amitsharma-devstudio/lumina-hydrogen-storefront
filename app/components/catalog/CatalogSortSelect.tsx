import {useNavigate, useLocation} from 'react-router';
import {ThemedDropdown} from '~/components/ui/ThemedDropdown';
import {buildSortedSearch} from '~/lib/catalogFacets';
import {CATALOG_SORT_OPTIONS, type CatalogSortKey} from '~/lib/catalogSort';

export function CatalogSortSelect({
  sort,
  className = 'w-full md:w-[260px]',
}: {
  sort: CatalogSortKey;
  className?: string;
}) {
  const navigate = useNavigate();
  const {pathname, search} = useLocation();

  return (
    <ThemedDropdown
      label="Sort products"
      value={sort}
      options={CATALOG_SORT_OPTIONS}
      className={className}
      onChange={(next) => {
        void navigate(`${pathname}${buildSortedSearch(search, next)}`, {
          preventScrollReset: true,
        });
      }}
    />
  );
}
