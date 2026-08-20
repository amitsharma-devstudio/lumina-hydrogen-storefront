import {getPaginationVariables} from '@shopify/hydrogen';
import type {Storefront} from '@shopify/hydrogen';
import type {
  PredictiveSearchQuery as PredictiveSearchQueryResult,
  RegularSearchQuery as RegularSearchQueryResult,
} from 'storefrontapi.generated';
import {RegularSearchQuery} from '~/graphql/queries/RegularSearchQuery';
import {PredictiveSearchQuery} from '~/graphql/queries/PredictiveSearchQuery';
import {
  getEmptyPredictiveSearchResult,
  type PredictiveSearchReturn,
  type RegularSearchReturn,
} from '~/lib/search';

type SearchLoaderArgs = {
  storefront: Storefront;
  request: Request;
};

type SearchLoadResult = PredictiveSearchReturn | RegularSearchReturn;

export async function loadSearch({
  storefront,
  request,
}: SearchLoaderArgs): Promise<SearchLoadResult> {
  const url = new URL(request.url);
  if (url.searchParams.has('predictive')) {
    return loadPredictiveSearch({storefront, request});
  }
  return loadRegularSearch({storefront, request});
}

async function loadRegularSearch({
  storefront,
  request,
}: SearchLoaderArgs): Promise<RegularSearchReturn> {
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(url.searchParams.get('q') || '');

  const {errors, ...items}: {errors?: Array<{message: string}>} &
    RegularSearchQueryResult = await storefront.query(RegularSearchQuery, {
    variables: {...variables, term},
    cache: storefront.CacheShort(),
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, {nodes}: {nodes: Array<unknown>}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}: {message: string}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

async function loadPredictiveSearch({
  storefront,
  request,
}: SearchLoaderArgs): Promise<PredictiveSearchReturn> {
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);

  if (!term) {
    return {type: 'predictive', term, result: getEmptyPredictiveSearchResult()};
  }

  const {
    predictiveSearch: items,
    errors,
  }: PredictiveSearchQueryResult & {errors?: Array<{message: string}>} =
    await storefront.query(PredictiveSearchQuery, {
      variables: {
        limit,
        limitScope: 'EACH',
        term,
      },
      cache: storefront.CacheShort(),
    });

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors
        .map(({message}: {message: string}) => message)
        .join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, item: Array<unknown>) => acc + item.length,
    0,
  );

  return {type: 'predictive', term, result: {items, total}};
}
