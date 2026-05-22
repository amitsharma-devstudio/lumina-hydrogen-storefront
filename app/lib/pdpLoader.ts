import type {Storefront} from '@shopify/hydrogen';
import {getSelectedProductOptions} from '@shopify/hydrogen';
import {ProductByHandleQuery} from '~/graphql/queries/ProductByHandle';
import {ProductRecommendationsQuery} from '~/graphql/queries/ProductRecommendations';
import type {CollectionProductList} from '~/components/home/productsSection.types';

export async function loadProductPageData(
  storefront: Storefront,
  {
    handle,
    request,
  }: {
    handle: string;
    request: Request;
  },
) {
  const {product} = await storefront.query(ProductByHandleQuery, {
    variables: {
      handle,
      selectedOptions: getSelectedProductOptions(request),
    },
  });

  if (!product?.id) {
    return null;
  }

  const recommendationsResponse = await storefront.query(
    ProductRecommendationsQuery,
    {variables: {productId: product.id}},
  );

  return {
    product,
    recommendations: (recommendationsResponse?.productRecommendations ??
      []) as CollectionProductList,
  };
}
