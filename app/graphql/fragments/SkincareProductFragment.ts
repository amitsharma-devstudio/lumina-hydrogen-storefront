import {RoutineProductFieldsFragment} from '~/graphql/fragments/RoutineProductFieldsFragment';

/** Shared metaobject field selection for skincare PDP intelligence. */
const MetaobjectFields = `#graphql
  fragment MetaobjectFields on Metaobject {
    id
    type
    fields {
      key
      value
    }
  }
` as const;

export const SkincareProductFragment = `#graphql
  fragment SkincareProduct on Product {
    heroClaim: metafield(namespace: "custom", key: "lumina_hero_claim") {
      id
      type
      value
    }

    howToUse: metafield(namespace: "custom", key: "lumina_how_to_use") {
      id
      type
      value
    }

    fullIngredients: metafield(namespace: "custom", key: "lumina_full_ingredients") {
      id
      type
      value
    }

    shippingAndReturns: metafield(namespace: "custom", key: "lumina_shipping_returns") {
      id
      type
      value
    }

    amPm: metafield(namespace: "custom", key: "lumina_am_pm") {
      id
      type
      value
    }

    safeWith: metafield(namespace: "custom", key: "lumina_safe_with") {
      references(first: 10) {
        nodes {
          ... on Metaobject {
            ...MetaobjectFields
          }
        }
      }
    }

    avoidWith: metafield(namespace: "custom", key: "lumina_avoid_with") {
      references(first: 10) {
        nodes {
          ... on Metaobject {
            ...MetaobjectFields
          }
        }
      }
    }

    productBenefits: metafield(namespace: "custom", key: "lumina_product_benefits") {
      references(first: 5) {
        nodes {
          ... on Metaobject {
            ...MetaobjectFields
          }
        }
      }
    }

    reviewCount: metafield(namespace: "custom", key: "lumina_reviews") {
      id
      type
      value
    }

    rating: metafield(namespace: "custom", key: "lumina_rating") {
      id
      type
      value
    }

    step: metafield(namespace: "custom", key: "lumina_step_order") {
      id
      type
      value
    }

    skinTypes: metafield(namespace: "custom", key: "skin_compatibility") {
      references(first: 10) {
        nodes {
          ... on Metaobject {
            ...MetaobjectFields
          }
        }
      }
    }

    skinCare: metafield(namespace: "custom", key: "lumina_skin_care") {
      reference {
        ... on Metaobject {
          ...MetaobjectFields
        }
      }
    }

    ingredients: metafield(namespace: "custom", key: "lumina_hero_ingredients") {
      references(first: 10) {
        nodes {
          ... on Metaobject {
            ...MetaobjectFields
          }
        }
      }
    }

    regimen: metafield(namespace: "custom", key: "lumina_regimen") {
      reference {
        ... on Metaobject {
          id
          type
          handle
          fields {
            key
            value
            references(first: 5) {
              nodes {
                ... on Product {
                  ...RoutineProductFields
                }
              }
            }
          }
        }
      }
    }

    routineProducts: metafield(namespace: "custom", key: "lumina_routine_products") {
      references(first: 5) {
        nodes {
          ... on Product {
            ...RoutineProductFields
          }
        }
      }
    }
  }
  ${MetaobjectFields}
  ${RoutineProductFieldsFragment}
`;
