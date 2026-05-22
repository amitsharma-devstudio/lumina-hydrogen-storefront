export const FeaturedCollectionFragment = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 1) {
      nodes {
        featuredImage {
          id
          url
          altText
          width
          height
        }
        images(first: 1) {
          nodes {
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
`;
