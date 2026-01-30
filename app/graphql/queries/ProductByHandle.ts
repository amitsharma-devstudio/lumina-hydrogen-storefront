//import { gql } from '@shopify/hydrogen';
import { ProductBaseFieldsFragment } from '~/graphql/fragments/ProductBaseFieldsFragment';
import { ImageFieldsFragment } from '~/graphql/fragments/ImageFieldsFragment';
import { VariantFieldsFragment } from '~/graphql/fragments/VariantFieldsFragment';
import { MoneyFieldsFragment } from '~/graphql/fragments/MoneyFieldsFragment';

export const ProductByHandleQuery = `#graphql
    query ProductByHandle($handle: String!) {
        product(handle: $handle) {
            ...ProductBaseFields

            images(first: 10) {
                edges {
                    node {
                        ...ImageFields
                    }
                }
            }

            variants(first: 10) {
                edges {
                    node {
                        ...VariantFields
                    }
                }
            }
        }
    }
    ${ProductBaseFieldsFragment}
    ${ImageFieldsFragment}
    ${VariantFieldsFragment}
    ${MoneyFieldsFragment}
`;
