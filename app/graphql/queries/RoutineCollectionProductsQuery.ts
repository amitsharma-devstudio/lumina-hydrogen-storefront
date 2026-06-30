import {RecommendedProductFragment} from '~/graphql/fragments/RecommendedProductFragment';

export const RoutineCollectionProductsQuery = `#graphql
  query RoutineCollectionProducts(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: $first) {
        nodes {
          ...RecommendedProduct
          routineStepType: metafield(
            namespace: "custom"
            key: "lumina_routine_step_type"
          ) {
            value
          }
          firstVariant: variants(first: 1) {
            nodes {
              id
              availableForSale
            }
          }
        }
      }
    }
  }
  ${RecommendedProductFragment}
`;
