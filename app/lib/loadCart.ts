import type {HydrogenRouterContextProvider} from '@shopify/hydrogen';

type CartLoaderContext = Pick<
  HydrogenRouterContextProvider,
  'cart' | 'storefront'
>;

/**
 * Load the cart and keep buyer country in sync with the active storefront market
 * so checkoutUrl reflects the correct locale, currency, and shipping region.
 */
export async function loadCart({cart, storefront}: CartLoaderContext) {
  let cartData = await cart.get();

  if (!cartData?.id) return cartData;

  const {country} = storefront.i18n;
  const currentCountry = cartData.buyerIdentity?.countryCode;

  if (currentCountry !== country) {
    const {cart: updated} = await cart.updateBuyerIdentity({countryCode: country});
    if (updated) cartData = updated;
  }

  return cartData;
}
