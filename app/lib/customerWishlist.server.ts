import {
  CUSTOMER_WISHLIST_METAFIELDS_SET,
  CUSTOMER_WISHLIST_QUERY,
} from '~/graphql/customer-account/CustomerWishlist';
import {
  WISHLIST_KEY,
  WISHLIST_METAFIELD_TYPE,
  WISHLIST_NAMESPACE,
  parseWishlistValue,
  serializeWishlist,
  type WishlistItem,
} from '~/lib/wishlist';

type CustomerAccountClient = {
  query: (
    query: string,
    options?: {variables?: Record<string, unknown>},
  ) => Promise<{
    data?: {
      customer?: {
        id: string;
        wishlist?: {value?: string | null} | null;
      } | null;
    } | null;
    errors?: Array<{message: string}>;
  }>;
  mutate: (
    mutation: string,
    options?: {variables?: Record<string, unknown>},
  ) => Promise<{
    data?: {
      metafieldsSet?: {
        userErrors?: Array<{message: string; code?: string}>;
      } | null;
    } | null;
    errors?: Array<{message: string}>;
  }>;
  i18n: {language: string};
};

export async function loadCustomerWishlistItems(
  customerAccount: CustomerAccountClient,
): Promise<{customerId: string; items: WishlistItem[]} | null> {
  const {data, errors} = await customerAccount.query(CUSTOMER_WISHLIST_QUERY, {
    variables: {language: customerAccount.i18n.language},
  });

  if (errors?.length || !data?.customer?.id) {
    return null;
  }

  return {
    customerId: data.customer.id,
    items: parseWishlistValue(data.customer.wishlist?.value),
  };
}

export async function saveCustomerWishlistItems(
  customerAccount: CustomerAccountClient,
  customerId: string,
  items: WishlistItem[],
): Promise<{ok: true} | {ok: false; error: string}> {
  const {data, errors} = await customerAccount.mutate(
    CUSTOMER_WISHLIST_METAFIELDS_SET,
    {
      variables: {
        metafields: [
          {
            ownerId: customerId,
            namespace: WISHLIST_NAMESPACE,
            key: WISHLIST_KEY,
            type: WISHLIST_METAFIELD_TYPE,
            value: serializeWishlist(items),
          },
        ],
      },
    },
  );

  const userErrors = data?.metafieldsSet?.userErrors ?? [];
  if (errors?.length || userErrors.length) {
    return {
      ok: false,
      error:
        [
          ...(errors?.map((error) => error.message) ?? []),
          ...userErrors.map((error) => error.message),
        ].join(', ') || 'Unable to save wishlist',
    };
  }

  return {ok: true};
}
