import {Link} from 'react-router';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {Breadcrumbs} from '~/components/ui/Breadcrumbs';
import {SearchField} from '~/components/search/SearchField';
import {SearchQuickLinks} from '~/components/search/SearchQuickLinks';
import type {RegularSearchReturn} from '~/lib/search';

type SearchPageViewProps = {
  term: string;
  result: RegularSearchReturn['result'] | null;
  error?: string;
};

export function SearchPageView({term, result, error}: SearchPageViewProps) {
  const total = result?.total ?? 0;
  const hasTerm = Boolean(term?.trim());
  const hasResults = hasTerm && total > 0;

  return (
    <main className="search-page bg-white">
      <section className="border-b border-neutral-100 bg-neutral-50/60">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:py-20">
          <Breadcrumbs
            items={[
              {label: 'Home', to: '/'},
              {label: 'Search'},
            ]}
          />
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            Find your routine
          </p>
          <h1 className="text-4xl font-light tracking-tight text-black md:text-5xl">
            Search
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
            Discover serums, cleansers, moisturizers, and curated collections
            tailored to your skin goals.
          </p>

          <div className="mt-10">
            <SearchForm>
              {({inputRef}) => (
                <SearchField
                  inputRef={inputRef}
                  defaultValue={term}
                  variant="page"
                />
              )}
            </SearchForm>
          </div>

          {!hasTerm ? <SearchQuickLinks /> : null}

          {hasTerm && hasResults ? (
            <p className="mt-8 text-sm text-neutral-600">
              <span className="font-medium text-neutral-900">{total}</span>{' '}
              {total === 1 ? 'result' : 'results'} for{' '}
              <span className="font-medium text-neutral-900">
                &ldquo;{term}&rdquo;
              </span>
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          {error ? (
            <p className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {!hasTerm ? (
            <SearchResultsPrompt />
          ) : !hasResults ? (
            <SearchResultsEmptyState term={term} />
          ) : (
            <SearchResults result={result!} term={term}>
              {({articles, pages, products, term}) => (
                <div className="space-y-16 lg:space-y-20">
                  <SearchResults.Products products={products} term={term} />
                  <SearchResults.Pages pages={pages} term={term} />
                  <SearchResults.Articles articles={articles} term={term} />
                </div>
              )}
            </SearchResults>
          )}
        </div>
      </section>
    </main>
  );
}

function SearchResultsPrompt() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <p className="text-lg font-light tracking-tight text-neutral-900">
        Start typing to explore the catalog
      </p>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        Or browse our{' '}
        <Link
          to="/collections"
          prefetch="intent"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          collections
        </Link>{' '}
        and{' '}
        <Link
          to="/collections/all"
          prefetch="intent"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          full product catalog
        </Link>
        .
      </p>
    </div>
  );
}

function SearchResultsEmptyState({term}: {term: string}) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200/90 bg-neutral-50/80 px-8 py-12 text-center shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">
        No matches
      </p>
      <p className="mt-3 text-2xl font-light tracking-tight text-neutral-900">
        Nothing found for &ldquo;{term}&rdquo;
      </p>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        Try a different keyword, or explore the store by category.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/collections/all"
          prefetch="intent"
          className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Shop all products
        </Link>
        <Link
          to="/collections"
          prefetch="intent"
          className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm text-foreground transition-colors hover:border-primary"
        >
          View collections
        </Link>
      </div>
    </div>
  );
}
