export const HomeHeroQuery = `#graphql
  query HomeHeroMetaobject(
    $country: CountryCode
    $language: LanguageCode
    $type: String!
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: $type, first: 1) {
      nodes {
        id
        type
        handle
        fields {
          key
          value
          reference {
            __typename
            ... on MediaImage {
              id
              image {
                id
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;
