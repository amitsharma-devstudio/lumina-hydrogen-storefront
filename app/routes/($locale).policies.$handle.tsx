import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).policies.$handle';
import {ComingSoonPage} from '~/components/ComingSoonPage';
import {
  getPlaceholderPageContent,
  getPlaceholderPageTitle,
} from '~/lib/placeholderPages';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.title ?? ''}`}];
};

export async function loader({params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const placeholder = getPlaceholderPageContent(params.handle);
  if (placeholder) {
    return placeholder;
  }

  return {title: getPlaceholderPageTitle(params.handle)};
}

export default function Policy() {
  const {title, description} = useLoaderData<typeof loader>();
  return <ComingSoonPage title={title} description={description} />;
}
