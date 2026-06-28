import {ProductCardFragment} from '~/graphql/fragments/ProductCardFragment';

export const CollectionProductsQuery = `#graphql
  query CollectionProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(
        sortKey: $sortKey
        reverse: $reverse
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        filters: $filters
      ) {
        nodes {
          ...ProductCard
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  ${ProductCardFragment}
`;
