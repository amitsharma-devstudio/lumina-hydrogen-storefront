/** Loads product tags to build PLP filter options for a collection. */
export const CollectionFilterFacetsQuery = `#graphql
  query CollectionFilterFacets(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 100) {
        nodes {
          tags
        }
      }
    }
  }
`;

/** Tag facets for full-store catalog (no `all` collection). */
export const CatalogFilterFacetsQuery = `#graphql
  query CatalogFilterFacets($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 100) {
      nodes {
        tags
      }
    }
  }
`;
