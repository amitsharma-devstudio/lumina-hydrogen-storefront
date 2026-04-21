import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/($locale)._index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
} from 'storefrontapi.generated';
import {HomeHero} from '~/components/home/HomeHero';
import {HomeFeatures} from '~/components/home/HomeFeatures';
import {HomeNewsletter} from '~/components/home/HomeNewsletter';
import {HomeCollections} from '~/components/home/HomeCollections';
import {HomeProductCard} from '~/components/home/HomeProductCard';
import {buildHomeHeroData} from '~/lib/homepage';

const BESTSELLERS_COLLECTION_HANDLE = 'bestsellers';
const NEW_ARRIVALS_COLLECTION_HANDLE = 'new-arrivals';
const HOME_HERO_METAOBJECT_TYPE = 'home_hero';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}, hero] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HOME_HERO_QUERY, {
      variables: {type: HOME_HERO_METAOBJECT_TYPE},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  const nodes = collections.nodes ?? [];
  const heroNode = hero?.metaobjects?.nodes?.[0] ?? null;
  const heroFields = (heroNode?.fields ?? []) as any[];

  return {
    featuredCollection: nodes[0],
    curatedCollections: nodes.slice(1, 5),
    hero: heroNode
      ? buildHomeHeroData({
          fields: heroFields,
          locale: context.storefront.i18n.language,
          imageKey: 'image',
        })
      : null,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const newArrivals = context.storefront
    .query(NEW_ARRIVALS_PRODUCTS_QUERY, {
      variables: {handle: NEW_ARRIVALS_COLLECTION_HANDLE},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const bestsellers = context.storefront
    .query(BESTSELLERS_PRODUCTS_QUERY, {
      variables: {handle: BESTSELLERS_COLLECTION_HANDLE},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    newArrivals,
    bestsellers,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="home">
      <HomeHero hero={data.hero} />
      <Bestsellers products={data.bestsellers} />
      <NewArrivals products={data.newArrivals} />
      <HomeCollections collections={data.curatedCollections ?? []} />
      <HomeFeatures />
      <HomeNewsletter />
    </main>
  );
}

function NewArrivals({
  products,
}: {
  products: Promise<any>;
}) {
  return (
    <section className="bg-white py-20" aria-labelledby="new-arrivals">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-16">
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            NEW ARRIVALS
          </div>
          <h2
            id="new-arrivals"
            className="text-4xl font-light tracking-tight text-black md:text-5xl"
          >
            Freshly Added
          </h2>
        </header>

        <Suspense fallback={<div className="text-neutral-500">Loading…</div>}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {(response?.collection?.products?.nodes ?? []).map(
                  (product: any) => (
                    <HomeProductCard key={product.id} product={product} />
                  ),
                )}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function Bestsellers({
  products,
}: {
  products: Promise<any>;
}) {
  return (
    <section className="bg-neutral-50 py-20" aria-labelledby="bestsellers">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-16">
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            BESTSELLERS
          </div>
          <h2
            id="bestsellers"
            className="text-4xl font-light tracking-tight text-black md:text-5xl"
          >
            Our Signature Collection
          </h2>
        </header>

        <Suspense fallback={<div className="text-neutral-500">Loading…</div>}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {(response?.collection?.products?.nodes ?? []).map(
                  (product: any) => (
                    <HomeProductCard key={product.id} product={product} />
                  ),
                )}
              </div>
            )}
          </Await>
        </Suspense>

        <div className="mt-10">
          <Link
            to="/products/all"
            prefetch="intent"
            className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm text-black transition-colors hover:border-black"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 5, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const HOME_HERO_QUERY = `#graphql
  query HomeHeroMetaobject(
    $country: CountryCode
    $language: LanguageCode
    $type: String!
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: $type, first: 1) {
      nodes {
        id
        type
        handle
        fields {
          key
          value
          reference {
            __typename
            ... on MediaImage {
              id
              image {
                id
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const BESTSELLERS_PRODUCTS_QUERY = `#graphql
  query BestsellersProducts(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 4) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
  }
  ${RECOMMENDED_PRODUCTS_QUERY}
` as const;

const NEW_ARRIVALS_PRODUCTS_QUERY = `#graphql
  query NewArrivalsProducts(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 4, sortKey: CREATED, reverse: true) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
  }
  ${RECOMMENDED_PRODUCTS_QUERY}
` as const;
