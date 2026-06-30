import { Suspense } from "react";
import { NavLink, Await } from "react-router";
import {
  useAnalytics,
  useOptimisticCart,
  type CartViewPayload,
} from "@shopify/hydrogen";
import type { HeaderQuery, CartApiQueryFragment } from "storefrontapi.generated";
import { useAside } from "~/components/Aside";

function Icon({
  name,
}: {
  name: 'search' | 'cart' | 'menu';
}) {
  const common = 'h-4 w-4';
  switch (name) {
    case 'search':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'cart':
      return (
        <svg
          className={common}
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
    case 'menu':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );
  }
}

const FALLBACK_HEADER_MENU = {
  id: "gid://shopify/Menu/199655587896",
  items: [
    { id: "1", title: "Shop", url: "/collections/all" },
    { id: "2", title: "Collections", url: "/collections" },
    { id: "3", title: "About", url: "/pages/about" },
  ],
};

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { open } = useAside();
  const { shop, menu } = header;

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-home-border)] bg-white/92 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
        <NavLink
          to="/"
          prefetch="intent"
          className="group inline-flex flex-col leading-none text-black no-underline"
        >
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em]">
            Lumina
          </span>
          <span className="mt-1 h-px w-full origin-left scale-x-75 bg-primary transition-transform group-hover:scale-x-100" />
        </NavLink>

        <ul className="hidden items-center gap-10 md:flex">
          {(menu || FALLBACK_HEADER_MENU).items.slice(0, 3).map((item) => {
            if (!item.url) return null;

            const url =
              item.url.includes("myshopify.com") ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(shop.primaryDomain.url)
                ? new URL(item.url).pathname
                : item.url;

            return (
              <li key={item.id}>
                <NavLink
                  to={url}
                  className={({isActive}) =>
                    `text-[0.8rem] font-medium uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? 'text-black'
                        : 'text-neutral-500 hover:text-black'
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              </li>
            );
        })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => open("search")}
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-700 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-black"
          >
            <Icon name="search" />
          </button>

          <NavLink
            to="/cart"
            prefetch="intent"
            aria-label="Open shopping cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-700 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-black"
          >
            <Icon name="cart" />
            <span
              className="cart-count absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none text-primary-foreground ring-2 ring-white"
              aria-live="polite"
              aria-atomic="true"
            >
              <CartCount cart={cart} />
            </span>
          </NavLink>


          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-700 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-black md:hidden"
            onClick={() => open("mobile")}
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>
        </div>
      </nav>
    </header>
  );
}

function CartCount({ cart }: { cart: Promise<CartApiQueryFragment | null> }) {
  return (
    <Suspense fallback={<span>0</span>}>
      <Await resolve={cart}>
        {(cart) => <span>{cart?.totalQuantity ?? 0}</span>}
      </Await>
    </Suspense>
  );
}
