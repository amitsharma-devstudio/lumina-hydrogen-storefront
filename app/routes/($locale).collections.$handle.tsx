import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections.$handle';
import {CollectionProductsPage} from '~/components/catalog/CollectionProductsPage';
import {loadCollectionProducts} from '~/lib/loadCollectionProducts';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {buildSeoMeta, getRequestOrigin} from '~/lib/seo';
import {JsonLd, buildBreadcrumbListJsonLd} from '~/components/seo/JsonLd';

export const meta: Route.MetaFunction = ({data}) => {
  const collection = data?.collection;
  const title = `${collection?.title ?? 'Collection'} | Lumina`;
  const description =
    collection?.description?.slice(0, 160) ||
    `Shop the ${collection?.title ?? 'collection'} at Lumina.`;

  return buildSeoMeta({
    title,
    description,
    url: `/collections/${collection?.handle ?? ''}`,
    origin: data?.seoOrigin,
    image: collection?.image?.url
      ? {
          url: collection.image.url,
          altText: collection.image.altText,
          width: collection.image.width,
          height: collection.image.height,
        }
      : null,
    type: 'website',
  });
};

export async function loader(args: Route.LoaderArgs) {
  const {handle} = args.params;
  if (!handle) {
    throw redirect('/collections');
  }

  const result = await loadCollectionProducts({
    storefront: args.context.storefront,
    request: args.request,
    handle,
    pageBy: 12,
  });

  if (!result.collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(args.request, {handle, data: result.collection});

  return {
    ...result,
    seoOrigin: getRequestOrigin(args.request),
  };
}

export default function Collection() {
  const {collection, sort, facets, seoOrigin} = useLoaderData<typeof loader>();

  return (
    <>
      <CollectionProductsPage
        collection={collection}
        sort={sort}
        facets={facets}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd(
          [
            {name: 'Home', url: '/'},
            {name: 'Collections', url: '/collections'},
            {
              name: collection.title,
              url: `/collections/${collection.handle}`,
            },
          ],
          seoOrigin,
        )}
      />
    </>
  );
}
