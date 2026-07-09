import {Money, type OptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Button, PrimaryLink} from '~/components/ui/Button';
import {CartDiscountSection, CartGiftCardSection} from '~/components/cart/CartPromoCodes';

type CartData = OptimisticCart<CartApiQueryFragment | null>;

function cartHasLineItems(cart: CartData) {
  const lines = cart?.lines?.nodes ?? [];
  const quantityFromLines = lines.reduce(
    (sum, line) => sum + (line.quantity ?? 0),
    0,
  );
  const totalQuantity = cart?.totalQuantity ?? 0;

  return lines.length > 0 || totalQuantity > 0 || quantityFromLines > 0;
}

/**
 * Merge optimistic cart with loader cart so checkout URL and promo fields
 * do not disappear while quantity updates are in flight.
 */
function mergeCartFields(optimistic: CartData, stable: CartData): CartData {
  if (!optimistic) return stable;
  if (!stable) return optimistic;

  return {
    ...optimistic,
    checkoutUrl: optimistic.checkoutUrl ?? stable.checkoutUrl,
    discountCodes: optimistic.discountCodes ?? stable.discountCodes,
    appliedGiftCards: optimistic.appliedGiftCards ?? stable.appliedGiftCards,
    cost: optimistic.cost ?? stable.cost,
  } as CartData;
}

export function CartOrderSummary({
  cart,
  stableCart,
}: {
  cart: CartData;
  /** Loader cart — keeps checkout + promos when optimistic cart omits them */
  stableCart?: CartData;
}) {
  const merged = mergeCartFields(cart, stableCart ?? cart);

  if (!cartHasLineItems(merged)) return null;

  const {cost, checkoutUrl, discountCodes, appliedGiftCards} = merged;

  return (
    <div
      role="complementary"
      aria-label="Order summary"
      className="cart-order-summary w-full rounded-2xl bg-neutral-50 p-5"
    >
      <h2 className="mb-4 text-lg font-medium text-neutral-900">Order Summary</h2>

      <section className="mb-4" aria-labelledby="cart-discount-heading">
        <CartDiscountSection discountCodes={discountCodes} />
      </section>

      <section
        className="mb-4 border-t border-neutral-200 pt-4"
        aria-labelledby="cart-gift-heading"
      >
        <CartGiftCardSection giftCards={appliedGiftCards} />
      </section>

      {cost ? (
        <section
          className="mb-4 space-y-2.5 border-t border-neutral-200 pt-4 text-sm"
          aria-label="Cart totals"
        >
          {cost.subtotalAmount ? (
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="tabular-nums text-neutral-900">
                <Money data={cost.subtotalAmount} />
              </span>
            </div>
          ) : null}
          {cost.totalTaxAmount ? (
            <div className="flex justify-between">
              <span className="text-neutral-600">Tax</span>
              <span className="tabular-nums text-neutral-900">
                <Money data={cost.totalTaxAmount} />
              </span>
            </div>
          ) : null}
          {cost.totalAmount ? (
            <div className="flex justify-between border-t border-neutral-200 pt-3 text-lg font-medium">
              <span>Total</span>
              <span className="tabular-nums">
                <Money data={cost.totalAmount} />
              </span>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="border-t border-neutral-200 pt-4">
        {checkoutUrl ? (
          <PrimaryLink
            href={checkoutUrl}
            className="py-3 text-sm font-medium uppercase tracking-[0.12em]"
          >
            Continue to Checkout
          </PrimaryLink>
        ) : (
          <Button
            type="button"
            disabled
            className="w-full rounded-xl py-3 text-sm font-medium uppercase tracking-[0.12em]"
          >
            Continue to Checkout
          </Button>
        )}

        <p className="mt-5 text-center text-[10px] leading-relaxed text-neutral-400">
          Shipping calculated at checkout
        </p>
      </section>
    </div>
  );
}
