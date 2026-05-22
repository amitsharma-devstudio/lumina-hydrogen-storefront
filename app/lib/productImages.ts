type ProductImage = {
  id?: string | null;
  url?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductWithImages = {
  featuredImage?: ProductImage | null;
  images?: {nodes?: ProductImage[] | null} | null;
};

/** Up to 5 unique images for card carousel (featured first). */
export function getProductCarouselImages(
  product: ProductWithImages,
  limit = 5,
): ProductImage[] {
  const seen = new Set<string>();
  const result: ProductImage[] = [];

  const add = (image: ProductImage | null | undefined) => {
    if (!image?.url || seen.has(image.url)) return;
    seen.add(image.url);
    result.push(image);
  };

  add(product.featuredImage);
  for (const node of product.images?.nodes ?? []) {
    add(node);
    if (result.length >= limit) break;
  }

  return result.slice(0, limit);
}
