import {ProductCardFragment} from '~/graphql/fragments/ProductCardFragment';

export const SearchProductFragment = `#graphql
  fragment SearchProduct on Product {
    __typename
    trackingParameters
    ...ProductCard
  }
  ${ProductCardFragment}
`;
