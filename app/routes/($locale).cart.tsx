import {useLoaderData, data, type HeadersFunction} from 'react-router';
import type {Route} from './+types/($locale).cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {Analytics, CartForm, useOptimisticCart} from '@shopify/hydrogen';
import {CartPageEmpty} from '~/components/cart/CartPageEmpty';
import {CartPageLineItem} from '~/components/cart/CartPageLineItem';
import {CartOrderSummary} from '~/components/cart/CartOrderSummary';
import {CartFreeShippingProgress} from '~/components/cart/CartFreeShippingProgress';
import {CartUpsellsSection} from '~/components/cart/CartUpsellsSection';
import {loadCart} from '~/lib/loadCart';
import {loadCartUpsells} from '~/lib/loadCartUpsells';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Your Cart | Lumina'},
    {name: 'robots', content: 'noindex, nofollow'},
  ];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      giftCardCodes.push(...inputs.giftCardCodes);

      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const cart = await loadCart(context);
  const upsells = await loadCartUpsells({
    storefront: context.storefront,
    cart,
  });

  return {cart, upsells};
}

export default function Cart() {
  const {cart: originalCart, upsells} = useLoaderData<typeof loader>();
  const cart = useOptimisticCart(originalCart);
  const lines = cart?.lines?.nodes ?? [];
  const hasLines = lines.length > 0;

  if (!hasLines) {
    return (
      <>
        <CartPageEmpty />
        <Analytics.CartView />
      </>
    );
  }

  return (
    <>
      <main className="cart-page bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:pt-8">
          <header className="mb-5 flex items-baseline justify-between gap-4 lg:mb-6">
            <h1 className="text-3xl font-light tracking-tight text-neutral-900 lg:text-4xl">
              Your Cart
            </h1>
            {cart?.totalQuantity ? (
              <p className="shrink-0 text-sm text-neutral-500">
                {cart.totalQuantity}{' '}
                {cart.totalQuantity === 1 ? 'item' : 'items'}
              </p>
            ) : null}
          </header>

          <div className="mb-8">
            <CartFreeShippingProgress
              subtotalAmount={cart?.cost?.subtotalAmount}
            />
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="min-w-0 space-y-5 lg:col-span-2">
              {lines.map((line) => (
                <CartPageLineItem key={line.id} line={line} />
              ))}

              <CartUpsellsSection upsells={upsells} />
            </div>

            <aside className="w-full lg:col-span-1 lg:self-stretch">
              <div className="lg:sticky lg:top-8 lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto">
                <CartOrderSummary
                  cart={cart}
                  stableCart={originalCart ?? undefined}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Analytics.CartView />
    </>
  );
}
