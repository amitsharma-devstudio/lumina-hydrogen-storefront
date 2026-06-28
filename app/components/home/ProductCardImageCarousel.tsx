import {useCallback, useRef, useState} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {
  PRODUCT_CARD_IMAGE_HEIGHT,
  PRODUCT_CARD_IMAGE_SIZES,
  PRODUCT_CARD_IMAGE_WIDTH,
} from '~/components/home/productGridClasses';
import {getProductCarouselImages} from '~/lib/productImages';
import type {ProductCardProduct} from '~/components/product/productCard.types';

type CarouselProduct = Pick<
  ProductCardProduct,
  'title' | 'featuredImage' | 'images'
>;

export type ProductCardImageCarouselVariant = 'catalog' | 'home';

export function ProductCardImageCarousel({
  product,
  productUrl,
  variant = 'home',
}: {
  product: CarouselProduct;
  productUrl: string;
  /** `catalog` = PLP placeholder; `home` = homepage sections */
  variant?: ProductCardImageCarouselVariant;
}) {
  const images = getProductCarouselImages(product, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const count = images.length;
  const hasMultiple = count > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      setActiveIndex((index + count) % count);
    },
    [count],
  );

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goTo(activeIndex + 1);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goTo(activeIndex - 1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultiple) return;
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const delta = touchStartX.current - endX;
    if (delta > 48) goTo(activeIndex + 1);
    else if (delta < -48) goTo(activeIndex - 1);
  };

  return (
    <div
      className="relative bg-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Link
        to={productUrl}
        prefetch="intent"
        className="relative block aspect-[4/5] max-h-[320px] w-full overflow-hidden sm:max-h-[340px]"
        aria-label={product.title}
      >
        {count > 0 ? (
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              width: `${count * 100}%`,
              transform: `translate3d(-${(activeIndex * 100) / count}%, 0, 0)`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={image.id ?? image.url ?? index}
                className="product-card-carousel-media flex h-full flex-shrink-0 items-center justify-center p-4 sm:p-5"
                style={{width: `${100 / count}%`}}
              >
                <Image
                  data={image}
                  alt={image.altText || product.title}
                  width={PRODUCT_CARD_IMAGE_WIDTH}
                  height={PRODUCT_CARD_IMAGE_HEIGHT}
                  aspectRatio="4/5"
                  sizes={PRODUCT_CARD_IMAGE_SIZES}
                  className="!h-auto !max-h-full !w-auto !max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        ) : variant === 'catalog' ? (
          <CatalogImagePlaceholder />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            No image
          </div>
        )}

        {hasMultiple ? (
          <div className="product-card-carousel-dots">
            {images.map((image, index) => (
              <button
                key={image.id ?? image.url ?? index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex(index);
                }}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex}
                className={`product-card-carousel-dot ${
                  index === activeIndex
                    ? 'product-card-carousel-dot--active'
                    : ''
                }`}
              />
            ))}
          </div>
        ) : null}
      </Link>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute top-1/2 left-2 z-30 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200/80 bg-white/95 text-neutral-700 shadow-sm opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 md:flex"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute top-1/2 right-2 z-30 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200/80 bg-white/95 text-neutral-700 shadow-sm opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 md:flex"
          >
            <ChevronRight />
          </button>
        </>
      ) : null}
    </div>
  );
}

function CatalogImagePlaceholder() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#f6f3ef] p-6"
      aria-hidden
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-200">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden
        >
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
        Image coming soon
      </span>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
