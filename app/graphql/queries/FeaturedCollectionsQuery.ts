import {FeaturedCollectionFragment} from '~/graphql/fragments/FeaturedCollectionFragment';

export const FeaturedCollectionsQuery = `#graphql
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 12, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
  ${FeaturedCollectionFragment}
`;
