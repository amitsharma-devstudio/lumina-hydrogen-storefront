import {useLoaderData} from 'react-router';
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
import {findSelectedSellingPlan, findCartSellingPlanIdForVariant} from '~/lib/sellingPlan';
import {buildSeoMeta, getRequestOrigin} from '~/lib/seo';
import {
  JsonLd,
  buildBreadcrumbListJsonLd,
  buildProductJsonLd,
} from '~/components/seo/JsonLd';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  const title = product?.title ? `${product.title} | Lumina` : 'Lumina';
  const description =
    product?.seo?.description ||
    product?.description?.slice(0, 160) ||
    'Clinical-grade skincare from Lumina.';
  const image =
    product?.selectedOrFirstAvailableVariant?.image ||
    product?.featuredImage ||
    product?.images?.nodes?.[0] ||
    null;

  return buildSeoMeta({
    title,
    description,
    url: `/products/${product?.handle ?? ''}`,
    origin: data?.seoOrigin,
    image: image?.url
      ? {
          url: image.url,
          altText: image.altText,
          width: image.width,
          height: image.height,
        }
      : null,
    type: 'product',
  });
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

  const url = new URL(request.url);
  let selectedSellingPlanId = url.searchParams.get('selling_plan');
  const explicitOneTime = url.searchParams.get('purchase') === 'once';

  // If this variant is already in the bag as a subscription, default to that plan
  // (unless the shopper explicitly chose one-time via purchase=once).
  if (!selectedSellingPlanId && !explicitOneTime) {
    const cart = await context.cart.get();
    selectedSellingPlanId = findCartSellingPlanIdForVariant(
      cart?.lines?.nodes,
      data.product.selectedOrFirstAvailableVariant?.id,
    );
  }

  const selectedSellingPlan = findSelectedSellingPlan(
    data.product.sellingPlanGroups,
    selectedSellingPlanId,
  );

  return {
    ...data,
    selectedSellingPlan,
    seoOrigin: getRequestOrigin(request),
  };
}

export default function Product() {
  const {product, recommendations, selectedSellingPlan, seoOrigin} =
    useLoaderData<typeof loader>();

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

  const productUrl = `${seoOrigin}/products/${product.handle}`;
  const productImage =
    selectedVariant?.image?.url ||
    product.featuredImage?.url ||
    product.images?.nodes?.[0]?.url ||
    null;

  return (
    <>
      <ProductDetailPage
        product={{
          ...product,
          productOptions,
          selectedOrFirstAvailableVariant: selectedVariant,
        }}
        recommendations={recommendations}
        selectedSellingPlan={selectedSellingPlan}
      />
      <JsonLd
        data={buildProductJsonLd({
          name: product.title,
          description: product.seo?.description || product.description,
          url: productUrl,
          image: productImage,
          sku: selectedVariant?.sku,
          brand: product.vendor || 'Lumina',
          price: selectedVariant?.price?.amount,
          currencyCode: selectedVariant?.price?.currencyCode,
          availability: selectedVariant?.availableForSale,
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd(
          [
            {name: 'Home', url: '/'},
            {name: 'Catalog', url: '/collections/all'},
            {name: product.title, url: `/products/${product.handle}`},
          ],
          seoOrigin,
        )}
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
