import type {ProductCardProduct} from '~/components/product/productCard.types';

/** Search API product node (PLP card fields + Shopify tracking). */
export type SearchProductNode = ProductCardProduct & {
  trackingParameters?: string | null;
};

export function mapSearchProductToCard(
  product: SearchProductNode,
): ProductCardProduct {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    tags: product.tags,
    availableForSale: product.availableForSale,
    featuredImage: product.featuredImage,
    images: product.images,
    priceRange: product.priceRange,
  };
}
