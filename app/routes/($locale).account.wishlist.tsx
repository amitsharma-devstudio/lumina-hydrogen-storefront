import {useEffect, useRef} from 'react';
import {useFetcher, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).account.wishlist';
import {Money} from '@shopify/hydrogen';
import {Link} from '~/components/Link';
import {
  AccountEmptyState,
  AccountSection,
} from '~/components/account/AccountShell';
import {Button} from '~/components/ui/Button';
import {useWishlist} from '~/components/wishlist/WishlistProvider';
import {loadCustomerWishlistItems} from '~/lib/customerWishlist.server';
import {WishlistProductsQuery} from '~/graphql/queries/WishlistProductsQuery';
import {useLocalizedPath} from '~/lib/i18n';
import type {WishlistItem} from '~/lib/wishlist';
import type {ProductCardFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Wishlist | Lumina'}];
};

export async function loader({context}: Route.LoaderArgs) {
  await context.customerAccount.handleAuthStatus();

  const wishlist = await loadCustomerWishlistItems(context.customerAccount);
  const items = wishlist?.items ?? [];
  const ids = items.map((item) => item.id);

  let products: Array<ProductCardFragment | null> = [];

  if (ids.length) {
    const {nodes} = await context.storefront.query(WishlistProductsQuery, {
      variables: {ids},
      cache: context.storefront.CacheShort(),
    });
    products = (nodes ?? []) as Array<ProductCardFragment | null>;
  }

  const productById = new Map(
    products
      .filter((product): product is ProductCardFragment =>
        Boolean(product?.id),
      )
      .map((product) => [product.id, product]),
  );

  return {
    items,
    productById: Object.fromEntries(productById),
  };
}

export default function AccountWishlist() {
  const {items: serverItems, productById} = useLoaderData<typeof loader>();
  const wishlist = useWishlist();
  const mergeFetcher = useFetcher();
  const didMerge = useRef(false);
  const apiPath = useLocalizedPath('/api/wishlist');

  // Merge any guest localStorage items into the customer metafield once
  useEffect(() => {
    if (didMerge.current || !wishlist.ready) return;
    didMerge.current = true;

    const localOnly = wishlist.items.filter(
      (item) => !serverItems.some((server) => server.id === item.id),
    );
    if (!localOnly.length) return;

    const form = new FormData();
    form.set('intent', 'merge');
    form.set('items', JSON.stringify(wishlist.items));
    mergeFetcher.submit(form, {method: 'POST', action: apiPath});
  }, [wishlist.ready, wishlist.items, serverItems, mergeFetcher, apiPath]);

  const displayItems =
    wishlist.ready && wishlist.items.length ? wishlist.items : serverItems;

  return (
    <AccountSection
      title="Wishlist"
      description="Products you’ve saved for later. Sign-in syncs this list across devices."
    >
      {displayItems.length ? (
        <ul className="divide-y divide-neutral-100">
          {displayItems.map((item) => (
            <WishlistRow
              key={item.id}
              item={item}
              product={productById[item.id] ?? null}
              onRemove={() => wishlist.remove(item.id)}
            />
          ))}
        </ul>
      ) : (
        <AccountEmptyState
          message="Your wishlist is empty. Tap the heart on any product to save it."
          action={{label: 'Browse products', to: '/collections/all'}}
        />
      )}
    </AccountSection>
  );
}

function WishlistRow({
  item,
  product,
  onRemove,
}: {
  item: WishlistItem;
  product: ProductCardFragment | null;
  onRemove: () => void;
}) {
  const title = product?.title ?? item.title;
  const handle = product?.handle ?? item.handle;
  const image =
    product?.featuredImage?.url ??
    product?.images?.nodes?.[0]?.url ??
    item.imageUrl;
  const imageAlt =
    product?.featuredImage?.altText ??
    product?.images?.nodes?.[0]?.altText ??
    item.imageAlt ??
    title;
  const price = product?.priceRange?.minVariantPrice;

  return (
    <li className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to={`/products/${handle}`}
          prefetch="intent"
          className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100"
        >
          {image ? (
            <img
              src={image}
              alt={imageAlt ?? title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </Link>
        <div className="min-w-0">
          <Link
            to={`/products/${handle}`}
            prefetch="intent"
            className="font-medium text-neutral-900 no-underline hover:text-primary"
          >
            {title}
          </Link>
          {price ? (
            <p className="mt-1 text-sm text-neutral-600">
              <Money data={price} />
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Link
          to={`/products/${handle}`}
          prefetch="intent"
          className="inline-flex h-9 items-center rounded-full border border-neutral-200 px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-700 no-underline transition hover:border-neutral-300 hover:text-neutral-900"
        >
          View
        </Link>
        <Button
          type="button"
          variant="secondary"
          className="!h-9 !min-h-9 px-4 text-[11px] uppercase tracking-[0.12em]"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </li>
  );
}
