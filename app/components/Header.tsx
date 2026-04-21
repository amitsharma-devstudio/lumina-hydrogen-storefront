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
    { id: "1", title: "Shop", url: "/products" },
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
  const { open } = useAside();  // ✅ correct hook usage
  const { shop, menu } = header;

  return (
    <header className="bg-white border-b border-neutral-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        {/* Logo */}
        <NavLink
          to="/"
          prefetch="intent"
          className="text-sm font-semibold tracking-[0.22em] text-black"
        >
          LUXE SKIN
        </NavLink>

        {/* Nav Links */}
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
                  className="text-sm text-neutral-600 transition-colors hover:text-black"
                >
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => open("search")}
            aria-label="Search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-black"
          >
            <Icon name="search" />
          </button>

          {/* Cart */}
          {/* <button className="icon-btn relative" onClick={() => open("cart")}>
            🛒
            <span className="cart-count absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-2">
              <CartCount cart={cart} />
            </span>
          </button> */}
          <NavLink
            to="/cart"
            prefetch="intent"
            aria-label="Open shopping cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-black"
          >
            <Icon name="cart" />
            <span
              className="cart-count absolute -top-2 -right-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-black px-1 text-[11px] leading-[18px] text-white"
              aria-live="polite"
              aria-atomic="true"
            >
              <CartCount cart={cart} />
            </span>
          </NavLink>


          {/* Mobile menu */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-black md:hidden"
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
