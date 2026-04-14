import {useLoaderData, data, type HeadersFunction} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import { Money } from '@shopify/hydrogen';
import { Image } from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';

export const meta: Route.MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
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

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      // Combine gift card codes already applied on cart
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
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  const {lines, cost, checkoutUrl} = cart;

  console.log('Cart Data:', cart);
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-widest text-neutral-500 mb-2">
            SHOPPING CART
          </p>
          <h1 className="text-4xl font-light text-neutral-900">
            Your Cart
          </h1>
        </div>

        {/* Main Grid: Cart Items + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Cart Items (takes 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {lines.nodes.map((line) => (
              <div key={line.id} className="border border-neutral-200 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Product Image - Using Hydrogen's Image component for optimization */}
                  <div className="w-full sm:w-32 h-48 sm:h-32 bg-neutral-100 rounded-xl flex-shrink-0 overflow-hidden">
                    {line.merchandise.image && (
                      <Image
                        data={line.merchandise.image}
                        aspectRatio="1/1"
                        sizes="128px"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-neutral-900">
                          {line.merchandise.product.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          {line.merchandise.title !== 'Default Title' ? line.merchandise.title : ''}
                        </p>
                      </div>
                      {/* Dynamic Price */}
                      <p className="font-medium text-neutral-900">
                        <Money data={line.cost.totalAmount} />
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 border border-neutral-200 rounded-lg px-4 py-2">
                        <button className="text-lg text-neutral-600">−</button>
                        <span className="w-8 text-center">{line.quantity}</span>
                        <button className="text-lg text-neutral-600">+</button>
                      </div>
                      <button className="text-sm text-neutral-500 underline">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-2xl p-6 sticky top-6">
              <h2 className="text-lg font-medium mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-900">
                    <Money data={cost.subtotalAmount ?? 0} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tax</span>
                  <span className="text-neutral-900">
                    {cost.totalTaxAmount && <Money data={cost.totalTaxAmount} />}
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-200 my-4"></div>

              <div className="flex justify-between text-lg font-medium mb-6">
                <span>Total</span>
                <span><Money data={cost.totalAmount ?? {}} /></span>
              </div>

              {/* Checkout Link */}
              <a
                href={checkoutUrl}
                style={{color: '#fff'}}
                className="block w-full text-center bg-black text-white visited:text-white active:text-white py-3 rounded-xl text-sm font-medium hover:bg-neutral-800"
              >
                Continue to Checkout
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
  // return (
  //   <div className="cart">
  //     <h1>Cart</h1>
  //     <CartMain layout="page" cart={cart} />
  //   </div>
  // );
}
