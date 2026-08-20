import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).search';
import {Analytics} from '@shopify/hydrogen';
import {SearchPageView} from '~/components/search/SearchPageView';
import {loadSearch} from '~/lib/loadSearch';
import {buildSeoMeta, getRequestOrigin} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => {
  const term = data?.term?.trim();
  const title = term ? `Search “${term}” | Lumina` : 'Search | Lumina';
  return buildSeoMeta({
    title,
    description: term
      ? `Search results for “${term}” at Lumina.`
      : 'Search Lumina products, collections, and pages.',
    url: term ? `/search?q=${encodeURIComponent(term)}` : '/search',
    origin: data?.seoOrigin,
    type: 'website',
  });
};

export async function loader({request, context}: Route.LoaderArgs) {
  try {
    const result = await loadSearch({
      storefront: context.storefront,
      request,
    });
    return {
      ...result,
      seoOrigin: getRequestOrigin(request),
    };
  } catch (error) {
    console.error(error);
    return {
      type: 'regular' as const,
      term: '',
      result: null,
      error: error instanceof Error ? error.message : 'Search failed',
      seoOrigin: getRequestOrigin(request),
    };
  }
}

export default function SearchPage() {
  const {type, term, result, error} = useLoaderData<typeof loader>();
  if (type === 'predictive') return null;

  return (
    <>
      <SearchPageView term={term} result={result} error={error} />
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </>
  );
}
