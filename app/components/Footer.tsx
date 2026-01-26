import { Suspense } from "react";
import { Await } from "react-router";
import type { FooterQuery, HeaderQuery } from "storefrontapi.generated";



/**
 * Dummy fallback menu
 * (replace with Shopify menu later)
 */
const FALLBACK_FOOTER_MENU: FooterQuery["menu"] = {
  id: "gid://shopify/Menu/199655620664",
  items: [
    {
      id: "1",
      title: "All Products",
      url: "/products",
      items: [],
    },
    {
      id: "2",
      title: "Collections",
      url: "/collections",
      items: [],
    },
    {
      id: "3",
      title: "Bestsellers",
      url: "/collections/bestsellers",
      items: [],
    },
    {
      id: "4",
      title: "New Arrivals",
      url: "/collections/new",
      items: [],
    },
    {
      id: "5",
      title: "About Us",
      url: "/pages/about",
      items: [],
    },
    {
      id: "6",
      title: "Careers",
      url: "/pages/careers",
      items: [],
    },
    {
      id: "7",
      title: "Contact",
      url: "/pages/contact",
      items: [],
    },
    {
      id: "8",
      title: "FAQ",
      url: "/pages/faq",
      items: [],
    },
    {
      id: "9",
      title: "Privacy Policy",
      url: "/policies/privacy-policy",
      items: [],
    },
    {
      id: "10",
      title: "Shipping Policy",
      url: "/policies/shipping-policy",
      items: [],
    },
    {
      id: "11",
      title: "Refund Policy",
      url: "/policies/refund-policy",
      items: [],
    },
    {
      id: "12",
      title: "Terms of Service",
      url: "/policies/terms-of-service",
      items: [],
    },
  ],
};

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => {
          // const menu = footer?.menu ?? FALLBACK_FOOTER_MENU;
          const menu = FALLBACK_FOOTER_MENU;

          return (
            <footer className="border-t border-gray-200 bg-gray-50 py-16">
              <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">

                  {/* Brand */}
                  <div className="md:col-span-2">
                    <div className="text-2xl font-light tracking-widest mb-4">
                      LUXE SKIN
                    </div>
                    <p className="text-sm text-gray-500">
                      Premium science-backed skincare for radiant, healthy skin.
                    </p>
                  </div>

                  {/* Dynamic Sections */}
                  <FooterSection
                    title="SHOP"
                    items={menu.items.slice(0, 4)}
                    publicStoreDomain={publicStoreDomain}
                    primaryDomainUrl={header.shop.primaryDomain?.url}
                  />
                  <FooterSection
                    title="COMPANY"
                    items={menu.items.slice(4, 8)}
                    publicStoreDomain={publicStoreDomain}
                    primaryDomainUrl={header.shop.primaryDomain?.url}
                  />
                  <FooterSection
                    title="SUPPORT"
                    items={menu.items.slice(8, 12)}
                    publicStoreDomain={publicStoreDomain}
                    primaryDomainUrl={header.shop.primaryDomain?.url}
                  />
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                  <div>© {new Date().getFullYear()} LUXE SKIN. All rights reserved.</div>

                  <div className="flex gap-6">
                    <a href="#" className="hover:text-black">IG</a>
                    <a href="#" className="hover:text-black">TW</a>
                    <a href="#" className="hover:text-black">FB</a>
                  </div>
                </div>
              </div>
            </footer>
          );
        }}
      </Await>
    </Suspense>
  );
}

function FooterSection({
  title,
  items,
  publicStoreDomain,
  primaryDomainUrl,
}: {
  title: string;
  items: FooterQuery["menu"]["items"];
  publicStoreDomain: string;
  primaryDomainUrl?: string;
}) {
  return (
    <div>
      <h4 className="text-xs tracking-widest font-medium mb-4">
        {title}
      </h4>

      <ul className="flex flex-col gap-3 text-sm text-gray-500">
        {items.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes("myshopify.com") ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl ?? "")
              ? new URL(item.url).pathname
              : item.url;

          const isExternal = !url.startsWith("/");

          return (
            <li key={item.id}>
              {isExternal ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              ) : (
                <a href={url}>{item.title}</a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
