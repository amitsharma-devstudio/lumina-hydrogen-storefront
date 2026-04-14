// Define this once
export const VariantFieldsFragment = `#graphql
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      ...MoneyFields
    }
    # ARCHITECT MOVE: Every variant now knows its parent handle
    # This satisfies getProductOptions and getAdjacentAndFirstAvailableVariants
    product {
      handle
    }
  }
`;