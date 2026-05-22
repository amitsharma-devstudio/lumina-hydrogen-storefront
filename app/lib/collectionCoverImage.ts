export type CollectionCardImage = {
  id?: string;
  url?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
} | null;

/** Shape used by CollectionCard (FeaturedCollection fragment + collections index query). */
export type CollectionCardCollection = {
  id: string;
  title: string;
  handle: string;
  image?: CollectionCardImage;
  products?: {
    nodes?: Array<{
      featuredImage?: CollectionCardImage;
      images?: {nodes?: CollectionCardImage[]};
    }>;
  };
};

/** Collection image, or first product image when the collection has no image. */
export function getCollectionCoverImage(collection: CollectionCardCollection) {
  if (collection.image?.url) return collection.image;

  const product = collection.products?.nodes?.[0];
  return (
    product?.featuredImage ?? product?.images?.nodes?.[0] ?? null
  );
}
