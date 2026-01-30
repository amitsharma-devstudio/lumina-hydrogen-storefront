//import { gql } from '@shopify/hydrogen';

export const MoneyFieldsFragment = `#graphql
    fragment MoneyFields on MoneyV2 {
        amount
        currencyCode
    }
`;