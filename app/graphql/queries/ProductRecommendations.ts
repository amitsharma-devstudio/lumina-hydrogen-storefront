export const ProductRecommendationsQuery = `#graphql
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
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
      images(first: 1) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

