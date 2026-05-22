import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections.$handle';
import {CollectionProductsPage} from '~/components/catalog/CollectionProductsPage';
import {loadCollectionProducts} from '~/lib/loadCollectionProducts';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.collection.title ?? 'Collection'} | Lumina`}];
};

export async function loader(args: Route.LoaderArgs) {
  const {handle} = args.params;

  if (!handle) {
    throw redirect('/collections');
  }

  const {collection, sort} = await loadCollectionProducts({
    storefront: args.context.storefront,
    request: args.request,
    handle,
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(args.request, {handle, data: collection});

  return {collection, sort};
}

export default function Collection() {
  const {collection, sort, filters, filterOptions} =
    useLoaderData<typeof loader>();

  return (
    <CollectionProductsPage
      collection={collection}
      sort={sort}
      filters={filters}
      filterOptions={filterOptions}
    />
  );
}
