/** Fields used to decide if a variant can be added to cart. */
export type VariantAvailabilityFields = {
  availableForSale?: boolean | null;
  quantityAvailable?: number | null;
};

/**
 * Storefront API `availableForSale` can be false even when Admin shows stock
 * (market/location context, missing inventory scope, or per-variant stock).
 * When `quantityAvailable` is exposed, treat positive quantity as purchasable.
 */
export function isVariantPurchasable(
  variant: VariantAvailabilityFields | null | undefined,
): boolean {
  if (!variant) return false;
  if (variant.availableForSale) return true;
  const quantity = variant.quantityAvailable;
  return typeof quantity === 'number' && quantity > 0;
}

export function findFirstPurchasableVariant<
  T extends VariantAvailabilityFields,
>(variants: T[] | null | undefined): T | null {
  if (!variants?.length) return null;
  return variants.find((variant) => isVariantPurchasable(variant)) ?? null;
}

/** Whether a picker chip can be selected for the current option combination. */
export function isOptionValuePurchasable({
  exists,
  available,
  firstSelectableVariant,
}: {
  exists?: boolean | null;
  available?: boolean | null;
  firstSelectableVariant?: VariantAvailabilityFields | null;
}): boolean {
  return (
    Boolean(exists) &&
    Boolean(available) &&
    isVariantPurchasable(firstSelectableVariant)
  );
}
