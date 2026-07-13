export const CUSTOMER_WISHLIST_QUERY = `#graphql
  query CustomerWishlist($language: LanguageCode) @inContext(language: $language) {
    customer {
      id
      wishlist: metafield(namespace: "lumina", key: "wishlist") {
        value
      }
    }
  }
` as const;

export const CUSTOMER_WISHLIST_METAFIELDS_SET = `#graphql
  mutation CustomerWishlistMetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
      }
      userErrors {
        field
        message
        code
      }
    }
  }
` as const;
