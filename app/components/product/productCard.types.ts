/** Minimal product shape for PLP cards and image carousel. */
export type ProductCardProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    id?: string;
    url?: string | null;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  images?: {
    nodes?: Array<{
      id?: string;
      url?: string | null;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};
