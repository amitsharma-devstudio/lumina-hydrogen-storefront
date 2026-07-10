export const CartUpsellProductFragment = `#graphql
  fragment CartUpsellProduct on Product {
    id
    handle
    title
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    step: metafield(namespace: "custom", key: "lumina_step_order") {
      value
    }
    skinCare: metafield(namespace: "custom", key: "lumina_skin_care") {
      reference {
        ... on Metaobject {
          id
          type
          fields {
            key
            value
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      availableForSale
    }
  }
`;
