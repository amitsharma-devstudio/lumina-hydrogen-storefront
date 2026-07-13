export const VariantFieldsFragment = `#graphql
  fragment VariantFields on ProductVariant {
    id
    title
    sku
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    image {
      ...ImageFields
    }
    price {
      ...MoneyFields
    }
    # ARCHITECT MOVE: Every variant now knows its parent handle
    # This satisfies getProductOptions and getAdjacentAndFirstAvailableVariants
    product {
      handle
    }
    sellingPlanAllocations(first: 10) {
      nodes {
        sellingPlan {
          id
        }
      }
    }
  }
`;

