import {RecommendedProductFragment} from '~/graphql/fragments/RecommendedProductFragment';

export const BestsellersProductsQuery = `#graphql
  query BestsellersProducts(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 5) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
  }
  ${RecommendedProductFragment}
`;
