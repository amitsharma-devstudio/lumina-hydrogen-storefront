import {Form, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).collections.$handle';
import {getPaginationVariables, Analytics, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {HomeProductCard} from '~/components/home/HomeProductCard';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

type SortKey =
  | 'FEATURED'
  | 'BEST_SELLING'
  | 'NEWEST'
  | 'PRICE_ASC'
  | 'PRICE_DESC';

const SORT_OPTIONS: Array<{value: SortKey; label: string}> = [
  {value: 'FEATURED', label: 'Featured'},
  {value: 'BEST_SELLING', label: 'Best selling'},
  {value: 'NEWEST', label: 'Newest'},
  {value: 'PRICE_ASC', label: 'Price: low to high'},
  {value: 'PRICE_DESC', label: 'Price: high to low'},
];

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
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const url = new URL(request.url);
  const sort = (url.searchParams.get('sort') as SortKey | null) ?? 'FEATURED';

  const sortVars:
    | {sortKey?: string; reverse?: boolean}
    | undefined =
    sort === 'FEATURED'
      ? undefined
      : sort === 'BEST_SELLING'
        ? {sortKey: 'BEST_SELLING', reverse: false}
        : sort === 'NEWEST'
          ? {sortKey: 'CREATED', reverse: true}
          : sort === 'PRICE_ASC'
            ? {sortKey: 'PRICE', reverse: false}
            : {sortKey: 'PRICE', reverse: true};

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables, ...sortVars},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    sort,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection, sort} = useLoaderData<typeof loader>();

  return (
    <main className="bg-white">
      <section className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
                Collection
              </div>
              <h1 className="text-4xl font-light tracking-tight text-black md:text-5xl">
                {collection.title}
              </h1>
              {collection.description ? (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
                  {collection.description}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-4 md:justify-end">
              <Form method="get" className="w-full md:w-auto">
                <label className="sr-only" htmlFor="sort">
                  Sort products
                </label>
                <div className="relative md:w-[260px]">
                  <select
                    id="sort"
                    name="sort"
                    defaultValue={sort ?? 'FEATURED'}
                    className="w-full appearance-none rounded-full border border-neutral-200 bg-white px-5 py-3 pr-12 text-sm text-black outline-none transition-colors hover:border-neutral-400 focus:border-neutral-400"
                    onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {collection.image ? (
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <div className="overflow-hidden rounded-2xl bg-neutral-50">
            <Image
              data={collection.image}
              alt={collection.image.altText || collection.title}
              className="h-[260px] w-full object-cover md:h-[340px]"
              sizes="(min-width: 45em) 1200px, 100vw"
            />
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 py-14">
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          autoLoadNext={{maxAutoLoads: 2}}
        >
          {({node: product}) => <HomeProductCard key={product.id} product={product} />}
        </PaginatedResourceSection>
      </section>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </main>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 1) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(
        sortKey: $sortKey
        reverse: $reverse
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
