import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

/**
 * Marketing threshold for the cart progress bar — not from Shopify metaobjects
 * or a shipping app. Real free-shipping rates are configured in Shopify Admin
 * → Settings → Shipping. Override via env when deploying.
 */
export const FREE_SHIPPING_THRESHOLD_AMOUNT = Number(
  typeof process !== 'undefined'
    ? process.env.PUBLIC_FREE_SHIPPING_THRESHOLD ?? 75
    : 75,
);

export type FreeShippingProgress = {
  threshold: number;
  subtotal: number;
  remaining: number;
  progressPercent: number;
  unlocked: boolean;
  currencyCode: CurrencyCode;
};

export function getFreeShippingProgress(
  subtotalAmount?: {
    amount?: string | null;
    currencyCode?: CurrencyCode;
  } | null,
): FreeShippingProgress | null {
  if (!subtotalAmount?.amount || !subtotalAmount.currencyCode) return null;

  const subtotal = Number.parseFloat(subtotalAmount.amount);
  if (!Number.isFinite(subtotal)) return null;

  const threshold = FREE_SHIPPING_THRESHOLD_AMOUNT;
  const remaining = Math.max(0, threshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / threshold) * 100);

  return {
    threshold,
    subtotal,
    remaining,
    progressPercent,
    unlocked: remaining <= 0,
    currencyCode: subtotalAmount.currencyCode,
  };
}
