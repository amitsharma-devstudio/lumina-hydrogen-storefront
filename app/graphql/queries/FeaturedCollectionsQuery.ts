import {FeaturedCollectionFragment} from '~/graphql/fragments/FeaturedCollectionFragment';

export const FeaturedCollectionsQuery = `#graphql
  query FeaturedCollections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 24
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
  ${FeaturedCollectionFragment}
`;
