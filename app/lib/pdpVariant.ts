import {redirect} from 'react-router';
import {
  isVariantPurchasable,
  type VariantAvailabilityFields,
} from '~/lib/variantAvailability';

type VariantOption = {name: string; value: string};

type VariantNode = VariantAvailabilityFields & {
  selectedOptions: VariantOption[];
};

type ProductWithVariants = {
  selectedOrFirstAvailableVariant?: VariantNode | null;
  variants?: {nodes?: VariantNode[]};
};

/** Send shoppers to the first in-stock variant when the URL points at an unavailable combo. */
export function redirectToFirstAvailableVariant(
  request: Request,
  product: ProductWithVariants,
) {
  const selected = product.selectedOrFirstAvailableVariant;
  if (!selected || isVariantPurchasable(selected)) return null;

  const availableVariant = product.variants?.nodes?.find((variant) =>
    isVariantPurchasable(variant),
  );
  if (!availableVariant) return null;

  const url = new URL(request.url);
  for (const option of availableVariant.selectedOptions) {
    url.searchParams.set(option.name, option.value);
  }

  return redirect(`${url.pathname}${url.search}`);
}
