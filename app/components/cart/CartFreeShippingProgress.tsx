import {Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {getFreeShippingProgress} from '~/lib/cartConversion';

type CartFreeShippingProgressProps = {
  subtotalAmount?: {
    amount?: string | null;
    currencyCode?: CurrencyCode;
  } | null;
};

export function CartFreeShippingProgress({
  subtotalAmount,
}: CartFreeShippingProgressProps) {
  const progress = getFreeShippingProgress(subtotalAmount);
  if (!progress) return null;

  const remainingMoney = {
    amount: progress.remaining.toFixed(2),
    currencyCode: progress.currencyCode,
  };

  return (
    <section
      aria-label="Free shipping progress"
      className={`cart-free-shipping-progress rounded-2xl border ${
        progress.unlocked
          ? 'border-primary/20 bg-primary-muted/40'
          : 'border-brand-100 bg-brand-50/50'
      }`}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium leading-relaxed text-neutral-900">
          {progress.unlocked ? (
            'You unlocked free shipping on this order'
          ) : (
            <>
              <Money data={remainingMoney} className="font-medium" /> away from
              free shipping
            </>
          )}
        </p>
        {!progress.unlocked ? (
          <p className="text-xs text-neutral-500">
            Orders over{' '}
            <Money
              data={{
                amount: String(progress.threshold),
                currencyCode: progress.currencyCode,
              }}
            />
          </p>
        ) : null}
      </div>

      <div
        className="h-2.5 overflow-hidden rounded-full bg-white/80 ring-1 ring-brand-100"
        role="progressbar"
        aria-valuenow={Math.round(progress.progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          progress.unlocked
            ? 'Free shipping unlocked'
            : 'Progress toward free shipping'
        }
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            progress.unlocked ? 'bg-primary' : 'bg-primary/90'
          }`}
          style={{width: `${progress.progressPercent}%`}}
        />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
        {progress.unlocked
          ? 'Shipping rates are confirmed at checkout.'
          : 'Based on cart subtotal. Shipping is calculated at checkout.'}
      </p>
    </section>
  );
}
