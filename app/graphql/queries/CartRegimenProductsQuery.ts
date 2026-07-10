import {CartUpsellProductFragment} from '~/graphql/fragments/CartUpsellProductFragment';

export const CartRegimenProductsQuery = `#graphql
  query CartRegimenProducts(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      ... on Product {
        id
        handle
        regimen: metafield(namespace: "custom", key: "lumina_regimen") {
          reference {
            ... on Metaobject {
              id
              fields {
                key
                value
                references(first: 8) {
                  nodes {
                    ... on Product {
                      ...CartUpsellProduct
                    }
                  }
                }
              }
            }
          }
        }
        routineProducts: metafield(namespace: "custom", key: "lumina_routine_products") {
          references(first: 8) {
            nodes {
              ... on Product {
                ...CartUpsellProduct
              }
            }
          }
        }
      }
    }
  }
  ${CartUpsellProductFragment}
`;
