/** Shared product grid layout for homepage and collection pages. */
export const PRODUCT_GRID_CLASSNAME =
  'grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6';

/** ~4-col PLP card width — keeps Hydrogen `Image` srcset from overshooting layout */
export const PRODUCT_CARD_IMAGE_WIDTH = 320;
export const PRODUCT_CARD_IMAGE_HEIGHT = 400;

export const PRODUCT_CARD_IMAGE_SIZES =
  '(min-width: 1280px) 280px, (min-width: 768px) 30vw, calc(100vw - 3rem)';
