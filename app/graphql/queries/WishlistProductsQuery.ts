import {ProductCardFragment} from '~/graphql/fragments/ProductCardFragment';

export const WishlistProductsQuery = `#graphql
  query WishlistProducts(
    $ids: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      ... on Product {
        ...ProductCard
      }
    }
  }
  ${ProductCardFragment}
`;
