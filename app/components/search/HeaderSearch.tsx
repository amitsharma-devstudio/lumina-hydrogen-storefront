import {Link} from 'react-router';
import {useEffect, useId, useRef, useState} from 'react';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchField} from '~/components/search/SearchField';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {btnPrimaryLinkClass} from '~/lib/theme';

/**
 * Inline header search: input + button, with a scrollable predictive panel below.
 */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const showPanel = open && query.trim().length > 0;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-xl">
      <SearchFormPredictive className="header-search-form w-full">
        {({fetchResults, goToSearch, inputRef}) => (
          <SearchField
            inputRef={inputRef}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              setOpen(true);
              fetchResults(value);
            }}
            onFocus={(event) => {
              const value = event.currentTarget.value;
              setQuery(value);
              setOpen(true);
              fetchResults(value);
            }}
            onViewAllClick={() => {
              setOpen(false);
              goToSearch();
            }}
            placeholder="Search products…"
            variant="header"
            ariaControls={panelId}
            ariaExpanded={showPanel}
          />
        )}
      </SearchFormPredictive>

      {showPanel ? (
        <div
          id={panelId}
          role="listbox"
          aria-label="Search suggestions"
          className="header-search-panel absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
        >
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {articles, collections, pages, products} = items;
              const hasTerm = Boolean(term.current?.trim());

              function dismiss() {
                setOpen(false);
                closeSearch();
              }

              if (state === 'loading' && hasTerm) {
                return (
                  <p className="py-6 text-center text-sm text-neutral-500">
                    Searching…
                  </p>
                );
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <>
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={dismiss}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={dismiss}
                    term={term}
                  />
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={dismiss}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={dismiss}
                    term={term}
                  />
                  {hasTerm ? (
                    <Link
                      onClick={dismiss}
                      to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(term.current)}`}
                      prefetch="intent"
                      className={`search-modal-view-all ${btnPrimaryLinkClass} mt-2 flex w-full justify-center rounded-full px-5 py-3 text-sm font-medium`}
                    >
                      View all results for &ldquo;{term.current}&rdquo;
                    </Link>
                  ) : null}
                </>
              );
            }}
          </SearchResultsPredictive>
        </div>
      ) : null}
    </div>
  );
}
