//import { gpl } from '@shopify/hydrogen'

export const ProductBaseFieldsFragment = `#graphql
    fragment ProductBaseFields on Product{
        id
        title
        handle
        descriptionHtml
    }
`;