import {useEffect, useId} from 'react';
import {useLocation} from 'react-router';
import {CatalogFilterBar} from '~/components/catalog/CatalogFilterBar';
import {countAppliedFilters, type FacetGroup} from '~/lib/catalogFacets';

type CatalogFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  facets: FacetGroup[];
};

export function CatalogFilterDrawer({
  open,
  onClose,
  facets,
}: CatalogFilterDrawerProps) {
  const titleId = useId();
  const {search} = useLocation();
  const activeCount = countAppliedFilters(search);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`catalog-filter-drawer fixed inset-0 z-50 lg:hidden ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close filters"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute inset-y-0 right-0 flex w-full max-w-[min(100vw,20rem)] flex-col bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2
            id={titleId}
            className="text-sm font-medium tracking-tight text-neutral-900"
          >
            Filters
            {activeCount > 0 ? (
              <span className="ml-2 text-neutral-500">({activeCount})</span>
            ) : null}
          </h2>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Close filters"
            onClick={onClose}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <CatalogFilterBar facets={facets} layout="drawer" />
        </div>
      </div>
    </div>
  );
}
