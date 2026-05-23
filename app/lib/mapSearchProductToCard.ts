import type {ProductCardProduct} from '~/components/product/productCard.types';

/** Search API product node (variant + tracking fields). */
export type SearchProductNode = {
  id: string;
  handle: string;
  title: string;
  selectedOrFirstAvailableVariant?: {
    image?: ProductCardProduct['featuredImage'];
    price?: {
      amount: string;
      currencyCode: string;
    };
  } | null;
};

export function mapSearchProductToCard(
  product: SearchProductNode,
): ProductCardProduct {
  const variant = product.selectedOrFirstAvailableVariant;
  const image = variant?.image ?? null;

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    featuredImage: image,
    images: image ? {nodes: [image]} : undefined,
    priceRange: {
      minVariantPrice: {
        amount: variant?.price?.amount ?? '0',
        currencyCode: variant?.price?.currencyCode ?? 'USD',
      },
    },
  };
}
