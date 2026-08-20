import {Link} from '~/components/Link';
import {Image} from '@shopify/hydrogen';
import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {HOME_SECTION_SURFACE_FLUSH} from '~/components/home/homeSectionStyles';
import {useCarousel} from '~/components/ui/useCarousel';
import {toClientPath, type HomePromoSlide} from '~/lib/homepage';

const AUTO_ADVANCE_MS = 6000;

const promoCtaClass =
  'inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-white px-8 py-3.5 text-sm font-medium text-primary no-underline shadow-md transition-colors hover:border-white hover:bg-brand-50 hover:text-primary-hover';

function useIsDesktopMd() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return isDesktop;
}

function useNearViewport(rootMargin = '200px') {
  const ref = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;

    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      {rootMargin},
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return {ref, near};
}

export function HomePromoCarousel({slides}: {slides: HomePromoSlide[]}) {
  const count = slides.length;
  const isDesktop = useIsDesktopMd();
  const {ref, near} = useNearViewport('240px');
  const {activeIndex, goTo, next, prev, setPaused, canLoop} = useCarousel(
    count,
    {
      intervalMs: AUTO_ADVANCE_MS,
      autoAdvance: isDesktop,
    },
  );

  if (!count) return null;

  function onCarouselKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!canLoop) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  }

  return (
    <section
      ref={ref}
      className={`home-promo-carousel relative w-full overflow-hidden ${HOME_SECTION_SURFACE_FLUSH}`}
      aria-roledescription="carousel"
      aria-label="Promotions"
      tabIndex={canLoop ? 0 : undefined}
      onKeyDown={onCarouselKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative min-h-[220px] w-full bg-neutral-900 sm:min-h-[280px] md:min-h-[360px]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const ctaPath = toClientPath(slide.cta?.url ?? null);
          const ctaLabel = slide.cta?.label ?? 'Shop now';
          const shouldRenderImage = near && (isActive || isDesktop);

          return (
            <article
              key={slide.id}
              className={`absolute inset-0 w-full transition-opacity duration-700 ease-in-out ${
                isActive
                  ? 'pointer-events-auto z-10 opacity-100'
                  : 'pointer-events-none z-0 opacity-0'
              }`}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              <div className="absolute inset-0">
                {shouldRenderImage && slide.image?.url ? (
                  <Image
                    data={slide.image}
                    alt={slide.image.altText ?? slide.title}
                    className="h-full w-full object-cover object-center"
                    sizes="(min-width: 768px) 100vw, 100vw"
                    width={isDesktop ? 1600 : 750}
                    height={isDesktop ? 720 : 480}
                    loading="lazy"
                    fetchPriority="low"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
              </div>

              <div className="relative z-10 mx-auto flex h-full min-h-[220px] w-full max-w-7xl flex-col justify-center px-6 py-12 sm:min-h-[280px] sm:px-10 md:min-h-[360px] md:px-14">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-100">
                  Lumina
                </p>
                <h2 className="max-w-xl text-3xl font-light text-white sm:text-4xl md:text-5xl">
                  {slide.title}
                </h2>
                {slide.subtitle ? (
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 md:text-base">
                    {slide.subtitle}
                  </p>
                ) : null}
                {slide.cta?.url ? (
                  <div className="mt-6">
                    {ctaPath?.startsWith('/') ? (
                      <Link
                        to={ctaPath}
                        prefetch="intent"
                        className={promoCtaClass}
                      >
                        {ctaLabel}
                      </Link>
                    ) : (
                      <a href={slide.cta.url} className={promoCtaClass}>
                        {ctaLabel}
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {canLoop ? (
        <>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/45 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="absolute top-1/2 left-4 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-lg text-white backdrop-blur-sm transition-colors hover:bg-black/45 md:flex"
            aria-label="Previous slide"
            onClick={prev}
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute top-1/2 right-4 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-lg text-white backdrop-blur-sm transition-colors hover:bg-black/45 md:flex"
            aria-label="Next slide"
            onClick={next}
          >
            ›
          </button>
        </>
      ) : null}
    </section>
  );
}
