import {data} from 'react-router';
import type {Route} from './+types/($locale).api.wishlist';
import {
  loadCustomerWishlistItems,
  saveCustomerWishlistItems,
} from '~/lib/customerWishlist.server';
import {
  mergeWishlistItems,
  parseWishlistValue,
  removeWishlistItem,
  serializeWishlist,
  upsertWishlistItem,
  type WishlistItem,
} from '~/lib/wishlist';

export async function loader({context}: Route.LoaderArgs) {
  const loggedIn = await context.customerAccount.isLoggedIn();
  if (!loggedIn) {
    return data({loggedIn: false, items: [] as WishlistItem[]});
  }

  const wishlist = await loadCustomerWishlistItems(context.customerAccount);
  return data({
    loggedIn: true,
    items: wishlist?.items ?? [],
  });
}

export async function action({request, context}: Route.ActionArgs) {
  const loggedIn = await context.customerAccount.isLoggedIn();
  if (!loggedIn) {
    return data(
      {ok: false as const, error: 'Sign in to sync your wishlist', items: []},
      {status: 401},
    );
  }

  const wishlist = await loadCustomerWishlistItems(context.customerAccount);
  if (!wishlist) {
    return data(
      {ok: false as const, error: 'Customer not found', items: []},
      {status: 400},
    );
  }

  const form = await request.formData();
  const intent = String(form.get('intent') ?? '');

  let nextItems = wishlist.items;

  if (intent === 'toggle') {
    const productId = String(form.get('productId') ?? '');
    const handle = String(form.get('handle') ?? '');
    const title = String(form.get('title') ?? '');
    const imageUrl = form.get('imageUrl');
    const imageAlt = form.get('imageAlt');

    if (!productId || !handle || !title) {
      return data(
        {ok: false as const, error: 'Missing product fields', items: nextItems},
        {status: 400},
      );
    }

    const exists = nextItems.some((item) => item.id === productId);
    nextItems = exists
      ? removeWishlistItem(nextItems, productId)
      : upsertWishlistItem(nextItems, {
          id: productId,
          handle,
          title,
          imageUrl: typeof imageUrl === 'string' ? imageUrl : null,
          imageAlt: typeof imageAlt === 'string' ? imageAlt : null,
        });
  } else if (intent === 'remove') {
    const productId = String(form.get('productId') ?? '');
    nextItems = removeWishlistItem(nextItems, productId);
  } else if (intent === 'merge') {
    const incoming = parseWishlistValue(String(form.get('items') ?? '[]'));
    nextItems = mergeWishlistItems(wishlist.items, incoming);
  } else if (intent === 'replace') {
    nextItems = parseWishlistValue(String(form.get('items') ?? '[]'));
  } else {
    return data(
      {ok: false as const, error: 'Unknown intent', items: nextItems},
      {status: 400},
    );
  }

  const saved = await saveCustomerWishlistItems(
    context.customerAccount,
    wishlist.customerId,
    nextItems,
  );

  if (!saved.ok) {
    return data(
      {ok: false as const, error: saved.error, items: wishlist.items},
      {status: 400},
    );
  }

  return data({
    ok: true as const,
    error: null,
    items: nextItems,
    serialized: serializeWishlist(nextItems),
  });
}
