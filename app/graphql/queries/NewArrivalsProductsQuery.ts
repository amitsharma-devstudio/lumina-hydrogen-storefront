import {RecommendedProductFragment} from '~/graphql/fragments/RecommendedProductFragment';

export const NewArrivalsProductsQuery = `#graphql
  query NewArrivalsProducts(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 5, sortKey: CREATED, reverse: true) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
  }
  ${RecommendedProductFragment}
`;
