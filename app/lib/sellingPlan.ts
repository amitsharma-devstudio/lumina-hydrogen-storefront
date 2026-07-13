import type {CurrencyCode, MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export type SellingPlanMoney = Pick<MoneyV2, 'amount' | 'currencyCode'>;

export type SellingPlanPriceAdjustment = {
  adjustmentValue:
    | {
        __typename: 'SellingPlanFixedAmountPriceAdjustment';
        adjustmentAmount: SellingPlanMoney;
      }
    | {
        __typename: 'SellingPlanFixedPriceAdjustment';
        price: SellingPlanMoney;
      }
    | {
        __typename: 'SellingPlanPercentagePriceAdjustment';
        adjustmentPercentage: number;
      };
  orderCount?: number | null;
};

export type SellingPlanLike = {
  id: string;
  name?: string | null;
  description?: string | null;
  options: Array<{name: string; value: string}>;
  priceAdjustments: SellingPlanPriceAdjustment[];
  recurringDeliveries?: boolean | null;
};

export type SellingPlanGroupLike = {
  name: string;
  appName?: string | null;
  options: Array<{name: string; values: string[]}>;
  sellingPlans: {nodes: SellingPlanLike[]};
};

export function findSelectedSellingPlan(
  sellingPlanGroups: {nodes: SellingPlanGroupLike[]} | null | undefined,
  selectedSellingPlanId: string | null,
): SellingPlanLike | null {
  if (!selectedSellingPlanId || !sellingPlanGroups?.nodes?.length) {
    return null;
  }

  for (const group of sellingPlanGroups.nodes) {
    const match = group.sellingPlans.nodes.find(
      (plan) => plan.id === selectedSellingPlanId,
    );
    if (match) return match;
  }

  return null;
}

/** Prefer a cart line's selling plan when the same variant is already subscribed. */
export function findCartSellingPlanIdForVariant(
  lines:
    | Array<{
        merchandise?: {id?: string | null} | null;
        sellingPlanAllocation?: {
          sellingPlan?: {id?: string | null} | null;
        } | null;
      }>
    | null
    | undefined,
  variantId: string | null | undefined,
): string | null {
  if (!variantId || !lines?.length) return null;

  const subscriptionLine = lines.find(
    (line) =>
      line.merchandise?.id === variantId &&
      Boolean(line.sellingPlanAllocation?.sellingPlan?.id),
  );

  return subscriptionLine?.sellingPlanAllocation?.sellingPlan?.id ?? null;
}

export function getSellingPlanPrice(
  basePrice: SellingPlanMoney,
  sellingPlan: SellingPlanLike | null | undefined,
): SellingPlanMoney {
  if (!sellingPlan?.priceAdjustments?.length) {
    return basePrice;
  }

  const currencyCode = basePrice.currencyCode as CurrencyCode;
  const amount = sellingPlan.priceAdjustments.reduce((acc, adjustment) => {
    const value = adjustment.adjustmentValue;
    if (value.__typename === 'SellingPlanFixedAmountPriceAdjustment') {
      return acc + parseFloat(value.adjustmentAmount.amount);
    }
    if (value.__typename === 'SellingPlanFixedPriceAdjustment') {
      return parseFloat(value.price.amount);
    }
    if (value.__typename === 'SellingPlanPercentagePriceAdjustment') {
      return acc * (1 - value.adjustmentPercentage / 100);
    }
    return acc;
  }, parseFloat(basePrice.amount));

  return {
    amount: amount.toFixed(2),
    currencyCode,
  };
}

export function sellingPlanLabel(plan: SellingPlanLike): string {
  if (plan.options?.length) {
    return plan.options.map((option) => option.value).join(' · ');
  }
  return plan.name ?? 'Subscription';
}
