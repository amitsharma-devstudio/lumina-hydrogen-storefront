import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ComingSoonPage} from '~/components/ComingSoonPage';
import {
  getPlaceholderPageContent,
  getPlaceholderPageTitle,
} from '~/lib/placeholderPages';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const placeholder = getPlaceholderPageContent(params.handle);
  if (placeholder) {
    return placeholder;
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
  ]);

  if (!page) {
    return {title: getPlaceholderPageTitle(params.handle)};
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {title: page.title};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const {title, description} = useLoaderData<typeof loader>();
  return <ComingSoonPage title={title} description={description} />;
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
