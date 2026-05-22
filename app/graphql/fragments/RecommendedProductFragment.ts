export const RecommendedProductFragment = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 5) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
`;
