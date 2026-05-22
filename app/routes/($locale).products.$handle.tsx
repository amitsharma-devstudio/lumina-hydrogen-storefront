import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import { ProductDetailPage } from '~/components/product/ProductDetailPage';

import { ProductByHandleQuery } from '~/graphql/queries/ProductByHandle';
import {ProductRecommendationsQuery} from '~/graphql/queries/ProductRecommendations';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args, {productId: criticalData.product.id});

  return {...criticalData, ...deferredData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(ProductByHandleQuery, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(
  {context}: Route.LoaderArgs,
  {productId}: {productId: string},
) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {
    recommendations: context.storefront.query(ProductRecommendationsQuery, {
      variables: {productId},
    }),
  };
}

export default function Product() {
  const {product, recommendations} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const props = {
    ...product,
    productOptions,
    recommendations: (recommendations as any)?.productRecommendations ?? [],
  };
  return <ProductDetailPage product= { props } />;
}

//import { type LoaderFunctionArgs, useLoaderData } from 'react-router'; 
// import { ProductByHandleQuery } from '~/graphql/queries/ProductByHandle';
// import { ProductDetailPage } from '~/components/product/ProductDetailPage';

// export async function loader({ context, params }: LoaderFunctionArgs) {
//   const { storefront } = context;
//   const { handle } = params;

//   if (!handle) {
//     throw new Response('No handle provided', { status: 400 });
//   }

//   // 1. Fetch data
//   const data = await storefront.query(ProductByHandleQuery, {
//     variables: { handle },
//   });

//   // 2. Safely check if the product exists
//   if (!data?.product) {
//     throw new Response('Product Not Found', { status: 404 });
//   }

//   // 3. Just return the object (No json() wrapper needed in RR7!)
//   return { product: data.product };
// }

// export default function ProductRoute() {
//   console.log("******** Inside ProductRoute");
//   // Use the hook normally
//   const { product } = useLoaderData<typeof loader>();
//   console.log("Product Data:", product);
//   return <ProductDetailPage product= { product } />;
// }
