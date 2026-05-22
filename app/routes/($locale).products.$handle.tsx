import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).products.$handle';
import {
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductDetailPage} from '~/components/product/ProductDetailPage';
import {loadProductPageData} from '~/lib/pdpLoader';
import {redirectToFirstAvailableVariant} from '~/lib/pdpVariant';
import {
  findFirstPurchasableVariant,
  isVariantPurchasable,
} from '~/lib/variantAvailability';

export const meta: Route.MetaFunction = ({data}) => {
  const title = data?.product?.title ?? '';
  return [
    {title: title ? `${title} | Lumina` : 'Lumina'},
    {
      rel: 'canonical',
      href: `/products/${data?.product?.handle ?? ''}`,
    },
  ];
};

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const data = await loadProductPageData(context.storefront, {handle, request});

  if (!data?.product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: data.product});

  const availabilityRedirect = redirectToFirstAvailableVariant(
    request,
    data.product,
  );
  if (availabilityRedirect) throw availabilityRedirect;

  return data;
}

export default function Product() {
  const {product, recommendations} = useLoaderData<typeof loader>();

  const optimisticVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const selectedVariant = isVariantPurchasable(optimisticVariant)
    ? optimisticVariant
    : findFirstPurchasableVariant(product.variants?.nodes) ??
      findFirstPurchasableVariant(
        getAdjacentAndFirstAvailableVariants(product),
      ) ??
      optimisticVariant;

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  return (
    <>
      <ProductDetailPage
        product={{
          ...product,
          productOptions,
          selectedOrFirstAvailableVariant: selectedVariant,
        }}
        recommendations={recommendations}
      />
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount ?? '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id ?? '',
              variantTitle: selectedVariant?.title ?? '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}
