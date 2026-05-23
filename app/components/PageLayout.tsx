import {Await, Link} from 'react-router';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
//import {Header, HeaderMenu} from '~/components/Header';
import {Header} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchField} from '~/components/search/SearchField';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {btnPrimaryLinkClass} from '~/lib/theme';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      {/* <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} /> */}
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside
      type="search"
      asideClassName="search-drawer"
      heading={
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
          Search
        </span>
      }
    >
      <div className="search-drawer-panel">
        <SearchFormPredictive className="search-drawer-form">
          {({fetchResults, goToSearch, inputRef}) => (
            <SearchField
              inputRef={inputRef}
              onChange={fetchResults}
              onFocus={fetchResults}
              onViewAllClick={goToSearch}
              placeholder="Search the catalog…"
              variant="drawer"
            />
          )}
        </SearchFormPredictive>

        <div className="search-drawer-results">
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {articles, collections, pages, products} = items;

              if (state === 'loading' && term.current) {
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
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total ? (
                    <Link
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                      prefetch="intent"
                      className={`search-drawer-view-all ${btnPrimaryLinkClass} mt-2 flex w-full justify-center rounded-full px-5 py-3 text-sm font-medium`}
                    >
                      View all results for &ldquo;{term.current}&rdquo;
                    </Link>
                  ) : null}
                </>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        {/* <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        /> */}
      </Aside>
    )
  );
}
