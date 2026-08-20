import {Suspense} from 'react';
import {Await} from 'react-router';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {AccountHeaderLink} from '~/components/account/AccountHeaderLink';
import {CountrySelector} from '~/components/CountrySelector';
import {HeaderSearch} from '~/components/search/HeaderSearch';
import {Link} from '~/components/Link';

function CartIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 6h15l-2 9H7L6 6Z" />
      <path d="M6 6 5 3H2" />
      <path d="M8 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  );
}

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({isLoggedIn, cart}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-home-border)] bg-white/92 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        {/* Desktop: logo | centered search | icons. Mobile: logo + icons, search on next row */}
        <nav className="grid grid-cols-[1fr_auto] items-center gap-x-4 py-3 md:grid-cols-[1fr_minmax(16rem,36rem)_1fr] md:gap-x-6 md:py-0 md:h-[76px]">
          <Link
            variant="nav"
            to="/"
            prefetch="intent"
            end
            className="group inline-flex shrink-0 flex-col justify-self-start leading-none text-black no-underline"
          >
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em]">
              Lumina
            </span>
            <span className="mt-1 h-px w-full origin-left scale-x-75 bg-primary transition-transform group-hover:scale-x-100" />
          </Link>

          <div className="col-span-2 mt-3 min-w-0 md:col-span-1 md:col-start-2 md:row-start-1 md:mt-0 md:justify-self-stretch">
            <HeaderSearch />
          </div>

          <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-self-end gap-1.5 sm:gap-2 md:col-start-3 md:gap-3">
            <div className="hidden" aria-hidden>
              <CountrySelector />
            </div>
            <AccountHeaderLink isLoggedIn={isLoggedIn} />

            <Suspense
              fallback={
                <Link
                  variant="nav"
                  to="/cart"
                  prefetch="intent"
                  aria-label="Open shopping cart, 0 items"
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-700 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-black"
                >
                  <CartIcon />
                  <span
                    className="cart-count absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground ring-2 ring-white"
                    aria-hidden
                  >
                    0
                  </span>
                </Link>
              }
            >
              <Await resolve={cart}>
                {(resolvedCart) => {
                  const count = resolvedCart?.totalQuantity ?? 0;
                  return (
                    <Link
                      variant="nav"
                      to="/cart"
                      prefetch="intent"
                      aria-label={`Open shopping cart, ${count} ${count === 1 ? 'item' : 'items'}`}
                      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-700 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-black"
                    >
                      <CartIcon />
                      <span
                        className="cart-count absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground ring-2 ring-white"
                        aria-hidden
                      >
                        {count}
                      </span>
                    </Link>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </nav>
      </div>
    </header>
  );
}
