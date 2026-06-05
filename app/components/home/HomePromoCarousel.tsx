import {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {HOME_SECTION_SURFACE_FLUSH} from '~/components/home/homeSectionStyles';
import {toClientPath, type HomePromoSlide} from '~/lib/homepage';

const AUTO_ADVANCE_MS = 6000;

const promoCtaClass =
  'inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-white px-8 py-3.5 text-sm font-medium text-primary no-underline shadow-md transition-colors hover:border-white hover:bg-brand-50 hover:text-primary-hover';

export function HomePromoCarousel({slides}: {slides: HomePromoSlide[]}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const canLoop = count > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      setActiveIndex((index + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!canLoop || paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [canLoop, count, paused]);

  if (!count) return null;

  return (
    <section
      className={`home-promo-carousel relative w-full overflow-hidden ${HOME_SECTION_SURFACE_FLUSH}`}
      aria-roledescription="carousel"
      aria-label="Promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[240px] w-full bg-neutral-900 sm:min-h-[300px] md:min-h-[360px]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const ctaPath = toClientPath(slide.cta?.url ?? null);
          const ctaLabel = slide.cta?.label ?? 'Shop now';

          return (
            <article
              key={slide.id}
              className={`absolute inset-0 w-full transition-opacity duration-700 ease-in-out ${
                isActive
                  ? 'pointer-events-auto z-10 opacity-100'
                  : 'pointer-events-none z-0 opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <div className="absolute inset-0">
                {slide.image?.url ? (
                  <Image
                    data={slide.image}
                    alt={slide.image.altText ?? slide.title}
                    className="h-full w-full object-cover object-center"
                    sizes="100vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
              </div>

              <div className="relative z-10 mx-auto flex h-full min-h-[240px] w-full max-w-7xl flex-col justify-center px-6 py-12 sm:min-h-[300px] sm:px-10 md:min-h-[360px] md:px-14">
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
            onClick={() => goTo(activeIndex - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute top-1/2 right-4 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-lg text-white backdrop-blur-sm transition-colors hover:bg-black/45 md:flex"
            aria-label="Next slide"
            onClick={() => goTo(activeIndex + 1)}
          >
            ›
          </button>
        </>
      ) : null}
    </section>
  );
}
