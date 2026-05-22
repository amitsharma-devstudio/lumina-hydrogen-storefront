import {useCallback, useRef, useState} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {getProductCarouselImages} from '~/lib/productImages';
import type {ProductCardProduct} from '~/components/product/productCard.types';

type CarouselProduct = Pick<
  ProductCardProduct,
  'title' | 'featuredImage' | 'images'
>;

export function ProductCardImageCarousel({
  product,
  productUrl,
}: {
  product: CarouselProduct;
  productUrl: string;
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
        className="relative block aspect-[4/5] max-h-[200px] w-full overflow-hidden sm:max-h-[220px]"
        aria-label={product.title}
      >
        {count > 0 ? (
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{transform: `translate3d(-${activeIndex * 100}%, 0, 0)`}}
          >
            {images.map((image, index) => (
              <div
                key={image.id ?? image.url ?? index}
                className="flex h-full min-w-full flex-shrink-0 items-center justify-center"
              >
                <Image
                  data={image}
                  alt={image.altText || product.title}
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 45vw"
                  className="h-full w-full object-contain p-4 sm:p-5"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            No image
          </div>
        )}
      </Link>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute top-1/2 left-2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200/80 bg-white/95 text-neutral-700 shadow-sm opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 md:flex"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute top-1/2 right-2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200/80 bg-white/95 text-neutral-700 shadow-sm opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 md:flex"
          >
            <ChevronRight />
          </button>

          <div className="absolute inset-x-0 bottom-2.5 z-20 flex justify-center gap-1.5">
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
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-4 bg-neutral-800'
                    : 'w-1.5 bg-neutral-300 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
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
