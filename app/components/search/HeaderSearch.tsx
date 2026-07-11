import {Link} from 'react-router';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchField} from '~/components/search/SearchField';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {btnPrimaryLinkClass} from '~/lib/theme';

/**
 * Inline header search: input + button, with a scrollable predictive panel below.
 * Arrow keys move through suggestion links; Enter activates the highlighted link
 * (or submits the form when nothing is highlighted).
 */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const optionIdPrefix = useId();
  const showPanel = open && query.trim().length > 0;

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    function onDocumentKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onDocumentKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onDocumentKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!showPanel || activeIndex < 0) return;
    const links = getSuggestionLinks(rootRef.current);
    const active = links[activeIndex];
    active?.scrollIntoView({block: 'nearest'});
    links.forEach((link, index) => {
      link.setAttribute('data-active', index === activeIndex ? 'true' : 'false');
      if (!link.id) {
        link.id = `${optionIdPrefix}-opt-${index}`;
      }
    });
  }, [activeIndex, showPanel, optionIdPrefix, query]);

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showPanel) return;

    const links = getSuggestionLinks(rootRef.current);
    if (!links.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % links.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? links.length - 1 : index - 1,
      );
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      links[activeIndex]?.click();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(links.length - 1);
    }
  }

  const activeOptionId =
    showPanel && activeIndex >= 0
      ? `${optionIdPrefix}-opt-${activeIndex}`
      : undefined;

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
            onKeyDown={handleInputKeyDown}
            onViewAllClick={() => {
              setOpen(false);
              setActiveIndex(-1);
              goToSearch();
            }}
            placeholder="Search products…"
            variant="header"
            ariaControls={panelId}
            ariaExpanded={showPanel}
            ariaActivedescendant={activeOptionId}
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
                setActiveIndex(-1);
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

function getSuggestionLinks(root: HTMLElement | null) {
  if (!root) return [] as HTMLAnchorElement[];
  const panel = root.querySelector('.header-search-panel');
  if (!panel) return [] as HTMLAnchorElement[];
  return Array.from(panel.querySelectorAll<HTMLAnchorElement>('a[href]'));
}
