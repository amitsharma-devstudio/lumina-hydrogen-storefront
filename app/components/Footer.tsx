import { Suspense } from "react";
import {Link} from '~/components/Link';
import {Await} from 'react-router';
import type { FooterQuery, HeaderQuery } from "storefrontapi.generated";
import {BESTSELLERS_COLLECTION_PATH} from '~/lib/storeCollections';
import {FooterSkeleton} from '~/components/ui/Skeleton';

/**
 * Dummy fallback menu
 * (replace with Shopify menu later)
 */
const FALLBACK_MENU_ITEM_BASE = {
  resourceId: null,
  tags: [] as string[],
  type: "HTTP" as const,
};

const FALLBACK_FOOTER_MENU: NonNullable<FooterQuery["menu"]> = {
  id: "gid://shopify/Menu/199655620664",
  items: [
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "1",
      title: "All Products",
      url: "/collections/all",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "2",
      title: "Collections",
      url: "/collections",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "3",
      title: "Bestsellers",
      url: BESTSELLERS_COLLECTION_PATH,
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "4",
      title: "New Arrivals",
      url: "/collections/new-arrivals",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "5",
      title: "About Us",
      url: "/pages/about",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "6",
      title: "Careers",
      url: "/pages/careers",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "7",
      title: "Contact",
      url: "/pages/contact",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "8",
      title: "FAQ",
      url: "/pages/faq",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "9",
      title: "Privacy Policy",
      url: "/policies/privacy-policy",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "10",
      title: "Shipping Policy",
      url: "/policies/shipping-policy",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
      id: "11",
      title: "Refund Policy",
      url: "/policies/refund-policy",
      items: [],
    },
    {
      ...FALLBACK_MENU_ITEM_BASE,
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
    <Suspense fallback={<FooterSkeleton />}>
      <Await resolve={footerPromise}>
        {(footer) => {
          // const menu = footer?.menu ?? FALLBACK_FOOTER_MENU;
          const menu: NonNullable<FooterQuery["menu"]> = FALLBACK_FOOTER_MENU;

          return (
            <footer className="lumina-footer border-t border-[var(--color-home-border)] py-16">
              <div className="mx-auto max-w-7xl px-6">
                <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-5">
                  <div className="md:col-span-2">
                    <div className="lumina-footer__brand mb-4 text-xl font-light uppercase tracking-[0.28em]">
                      Lumina
                    </div>
                    <p className="lumina-footer__copy max-w-sm text-sm leading-7">
                      Barrier-first skincare shaped by clinical actives, quiet
                      rituals, and formulas made to earn a permanent place on
                      the shelf.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2">
                      {['Clinical', 'Clean', 'Ritual'].map((label) => (
                        <span
                          key={label}
                          className="lumina-footer__pill rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

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

                <div className="lumina-footer__bottom flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row">
                  <div>© {new Date().getFullYear()} Lumina. All rights reserved.</div>

                  <div className="flex gap-6">
                    <a href="https://www.instagram.com" className="lumina-footer__link transition-colors">IG</a>
                    <a href="https://www.tiktok.com" className="lumina-footer__link transition-colors">TT</a>
                    <a href="https://www.youtube.com" className="lumina-footer__link transition-colors">YT</a>
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
  items: NonNullable<FooterQuery["menu"]>["items"];
  publicStoreDomain: string;
  primaryDomainUrl?: string;
}) {
  return (
    <div>
      <h4 className="lumina-footer__heading mb-4 text-[10px] font-medium uppercase tracking-[0.2em]">
        {title}
      </h4>

      <ul className="flex flex-col gap-3 text-sm">
        {items.map((item: NonNullable<FooterQuery["menu"]>["items"][number]) => {
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
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lumina-footer__link transition-colors"
                >
                  {item.title}
                </a>
              ) : (
                <Link variant="nav" to={url} className="lumina-footer__link transition-colors">
                  {item.title}
                </Link>
              )}
            </li>

          );
        })}
      </ul>
    </div>
  );
}
