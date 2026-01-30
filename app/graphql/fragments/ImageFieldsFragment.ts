//import { gql } from '@shopify/hydrogen';

export const ImageFieldsFragment = `#graphql
    fragment ImageFields on Image {
        url
        altText
        width
        height
    }
`;