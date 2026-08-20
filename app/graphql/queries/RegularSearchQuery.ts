import {SearchArticleFragment} from '~/graphql/fragments/SearchArticleFragment';
import {SearchPageFragment} from '~/graphql/fragments/SearchPageFragment';
import {SearchProductFragment} from '~/graphql/fragments/SearchProductFragment';
import {PageInfoFragment} from '~/graphql/fragments/PageInfoFragment';

export const RegularSearchQuery = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(query: $term, types: [ARTICLE], first: $first) {
      nodes {
        ... on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(query: $term, types: [PAGE], first: $first) {
      nodes {
        ... on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor
      before: $startCursor
      first: $first
      last: $last
      query: $term
      sortKey: RELEVANCE
      types: [PRODUCT]
      unavailableProducts: HIDE
    ) {
      nodes {
        ... on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SearchArticleFragment}
  ${SearchPageFragment}
  ${SearchProductFragment}
  ${PageInfoFragment}
`;
