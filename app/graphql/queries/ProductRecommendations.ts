import {RecommendedProductFragment} from '~/graphql/fragments/RecommendedProductFragment';

export const ProductRecommendationsQuery = `#graphql
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...RecommendedProduct
    }
  }
  ${RecommendedProductFragment}
`;
