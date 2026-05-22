import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections._index';
import {CollectionCard} from '~/components/collection/CollectionCard';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import type {CollectionCardCollection} from '~/lib/collectionCoverImage';
import {FeaturedCollectionFragment as FeaturedCollectionFragmentDoc} from '~/graphql/fragments/FeaturedCollectionFragment';
import {
  filterMerchandisingCollections,
  sortStoreCollections,
} from '~/lib/storeCollections';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Collections | Lumina'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 50},
  });

  const nodes = collections?.nodes ?? [];
  const merchandising = filterMerchandisingCollections(nodes);
  const sorted = sortStoreCollections(merchandising);

  return {collections: sorted};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <header className="mb-12 lg:mb-16">
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            Shop by collection
          </p>
          <h1 className="text-4xl font-light tracking-tight text-neutral-900 md:text-5xl">
            All Collections
          </h1>
          <p className="mt-4 max-w-2xl text-base text-neutral-600">
            Browse by routine and category. For every product in the store, see{' '}
            <a
              href="/collections/all"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Shop all products
            </a>
            .
          </p>
        </header>

        {collections.length > 0 ? (
          <div className={PRODUCT_GRID_CLASSNAME}>
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection as CollectionCardCollection}
                loading={index < 6 ? 'eager' : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="text-neutral-600">
            No collections found. Publish collections to the Online Store channel
            in Shopify Admin.
          </p>
        )}
      </div>
    </main>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query StoreCollectionsIndex(
    $country: CountryCode
    $language: LanguageCode
    $first: Int!
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
  ${FeaturedCollectionFragmentDoc}
` as const;
