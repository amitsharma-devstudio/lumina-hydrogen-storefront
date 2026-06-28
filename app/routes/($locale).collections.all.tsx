import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections.all';
import {CollectionProductsPage} from '~/components/catalog/CollectionProductsPage';
import {loadAllProductsCatalog} from '~/lib/loadAllProductsCatalog';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.collection?.title ?? 'Shop All'} | Lumina`}];
};

export async function loader(args: Route.LoaderArgs) {
  const result = await loadAllProductsCatalog({
    storefront: args.context.storefront,
    request: args.request,
    pageBy: 12,
  });

  if (!result.collection) {
    throw new Response('Product catalog not found', {
      status: 404,
    });
  }

  return result;
}

export default function AllProductsCollection() {
  const {collection, sort, facets} = useLoaderData<typeof loader>();

  return (
    <CollectionProductsPage collection={collection} sort={sort} facets={facets} />
  );
}
