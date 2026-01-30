//import { gql } from '@shopify/hydrogen';
import { MoneyFieldsFragment } from './MoneyFieldsFragment';
import { ImageFieldsFragment } from './ImageFieldsFragment';

export const VariantFieldsFragment = `#graphql
    fragment VariantFields on ProductVariant {
        id
        title
        price {
            ...MoneyFields
        }
        selectedOptions {
            name
            value
        }
        image {
            ...ImageFields
        }
        availableForSale
        compareAtPriceV2 {
            ...MoneyFields
        }
    }
`;