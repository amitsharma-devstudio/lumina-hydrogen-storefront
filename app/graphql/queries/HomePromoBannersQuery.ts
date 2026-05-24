export const HomePromoBannersQuery = `#graphql
  query HomePromoBanners(
    $country: CountryCode
    $language: LanguageCode
    $type: String!
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: $type, first: $first) {
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
