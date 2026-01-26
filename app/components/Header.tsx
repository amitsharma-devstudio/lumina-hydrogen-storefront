import { Suspense } from "react";
import { NavLink, Await } from "react-router";
import {
  useAnalytics,
  useOptimisticCart,
  type CartViewPayload,
} from "@shopify/hydrogen";
import type { HeaderQuery, CartApiQueryFragment } from "storefrontapi.generated";
import { useAside } from "~/components/Aside";

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
    <header className="bg-white border-b">
      <nav className="nav-container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="logo font-bold tracking-widest text-xl">
          <NavLink to="/" prefetch="intent">
            LUXE SKIN
          </NavLink>
        </div>

        {/* Nav Links */}
        <ul className="nav-links hidden md:flex gap-8">
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
                <NavLink to={url} className="text-sm font-medium">
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Icons */}
        <div className="nav-icons flex items-center gap-4">
          {/* Search */}
          <button className="icon-btn" onClick={() => open("search")}>
            🔍
          </button>

          {/* Cart */}
          <button className="icon-btn relative" onClick={() => open("cart")}>
            🛒
            <span className="cart-count absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-2">
              <CartCount cart={cart} />
            </span>
          </button>

          {/* Mobile menu */}
          <button
            className="icon-btn mobile-menu-btn md:hidden"
            onClick={() => open("mobile")}
          >
            ☰
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
