export const SellingPlanFragments = `#graphql
  fragment SellingPlanMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment SellingPlan on SellingPlan {
    id
    name
    description
    options {
      name
      value
    }
    priceAdjustments {
      adjustmentValue {
        ... on SellingPlanFixedAmountPriceAdjustment {
          __typename
          adjustmentAmount {
            ...SellingPlanMoney
          }
        }
        ... on SellingPlanFixedPriceAdjustment {
          __typename
          price {
            ...SellingPlanMoney
          }
        }
        ... on SellingPlanPercentagePriceAdjustment {
          __typename
          adjustmentPercentage
        }
      }
      orderCount
    }
    recurringDeliveries
  }
  fragment SellingPlanGroup on SellingPlanGroup {
    name
    appName
    options {
      name
      values
    }
    sellingPlans(first: 10) {
      nodes {
        ...SellingPlan
      }
    }
  }
`;
