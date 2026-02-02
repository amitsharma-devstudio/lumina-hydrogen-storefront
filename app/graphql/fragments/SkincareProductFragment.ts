export const SkincareProductFragment = `#graphql
  fragment SkincareProduct on Product {
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
            id
            field: field(key: "label") {
              value
            }
          }
        }
      }
    }
    
    skinCare: metafield(namespace: "custom", key: "lumina_skin_care") {
      reference {
        ... on Metaobject {
          id
          field: field(key: "label") {
            value
          }
        }
      }
    }
  }
`;