import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections._index';
import {CollectionCard} from '~/components/collection/CollectionCard';
import {Breadcrumbs} from '~/components/ui/Breadcrumbs';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import type {CollectionCardCollection} from '~/lib/collectionCoverImage';
import {FeaturedCollectionFragment as FeaturedCollectionFragmentDoc} from '~/graphql/fragments/FeaturedCollectionFragment';
import {
  filterMerchandisingCollections,
  sortStoreCollections,
} from '~/lib/storeCollections';
import {btnPrimaryLinkClass} from '~/lib/theme';

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
    <main className="collections-index bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">
          <Breadcrumbs
            items={[
              {label: 'Home', to: '/'},
              {label: 'Collections'},
            ]}
          />
          <div className="mt-6">
            <Link
              to="/collections/all"
              prefetch="intent"
              className={`${btnPrimaryLinkClass} rounded-full px-8 py-3.5 text-sm`}
            >
              Shop all products
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
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
