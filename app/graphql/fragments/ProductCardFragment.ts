import {MoneyFieldsFragment} from '~/graphql/fragments/MoneyFieldsFragment';

/** Product fields for PLP cards (collection pages, catalog, homepage grids). */
export const ProductCardFragment = `#graphql
  fragment ProductCard on Product {
    id
    handle
    title
    tags
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 5) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
  }
  ${MoneyFieldsFragment}
`;
