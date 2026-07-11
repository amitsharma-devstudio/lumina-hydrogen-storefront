import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {ReactNode} from 'react';
import {HOME_SECTION_MUTED_FLUSH} from '~/components/home/homeSectionStyles';
import {useCarousel} from '~/components/ui/useCarousel';
import {toClientPath, type HeroLink, type HomeHeroData} from '~/lib/homepage';

const HERO_AUTO_ADVANCE_MS = 5000;

function Cta({
  link,
  variant,
  children,
}: {
  link: HeroLink;
  variant: 'primary' | 'secondary';
  children: ReactNode;
}) {
  const href = link?.url ?? '';
  const className =
    variant === 'primary'
      ? 'lumina-btn-primary inline-flex min-h-12 items-center gap-2 rounded-full px-9 py-3.5 text-sm font-medium shadow-[0_12px_30px_rgba(111,69,48,0.18)] transition-all duration-200 hover:-translate-y-0.5 md:px-12'
      : 'lumina-btn-secondary inline-flex min-h-12 items-center rounded-full px-9 py-3.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 md:px-12';

  const path = toClientPath(href);

  if (path && path.startsWith('/')) {
    return (
      <Link to={path} prefetch="intent" className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href || undefined}
      className={className}
      rel="noreferrer"
      target="_self"
    >
      {children}
    </a>
  );
}

export function HomeHero({hero}: {hero: NonNullable<HomeHeroData>}) {
  const products = hero.products ?? [];
  const hasProducts = products.length > 0;
  const {activeIndex, goTo, setPaused, canLoop} = useCarousel(products.length, {
    intervalMs: HERO_AUTO_ADVANCE_MS,
  });
  const activeProduct = hasProducts ? products[activeIndex] : null;
  const priceText = activeProduct?.priceText ?? hero.startingFromValue ?? null;

  return (
    <section className={`relative overflow-hidden ${HOME_SECTION_MUTED_FLUSH}`}>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-8 px-6 py-10 md:grid-cols-[0.92fr_1.08fr] md:gap-12 md:py-14 lg:min-h-[680px]">
        <div className="order-2 flex flex-col justify-center gap-8 py-4 md:order-1">
          <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-neutral-500">
            <span className="text-primary">Lumina</span>
            <span className="h-px w-8 bg-brand-200" aria-hidden />
            <span>Barrier-first skincare</span>
          </div>
          <h1 className="max-w-[11ch] text-[3rem] font-[300] leading-[1.01] text-black sm:text-[3.75rem] md:text-[4.75rem]">
            {hero.headline}
          </h1>
          {hero.subhead ? (
            <p className="max-w-xl text-lg leading-8 text-neutral-600 md:text-xl md:leading-9">
              {hero.subhead}
            </p>
          ) : null}

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
            {hero.primaryCta?.url ? (
              <Cta link={hero.primaryCta} variant="primary">
                {hero.primaryCta.label || 'Shop Now'}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Cta>
            ) : null}

            {hero.secondaryCta?.url ? (
              <Cta link={hero.secondaryCta} variant="secondary">
                {hero.secondaryCta.label || 'Our Story'}
              </Cta>
            ) : null}
          </div>

          <dl className="grid max-w-xl grid-cols-3 border-y border-[var(--color-home-border)] py-5">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                Clinical
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-950">
                Tested actives
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                Clean
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-950">
                Fragrance-aware
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                Ritual
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-950">
                AM to PM
              </dd>
            </div>
          </dl>
        </div>

        <div className="order-1 flex flex-col md:order-2">
          <div
            className="relative min-h-[430px] flex-1 sm:min-h-[520px] md:min-h-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription={hasProducts ? 'carousel' : undefined}
            aria-label={hasProducts ? 'Featured products' : undefined}
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-white/40" aria-hidden />

            {hasProducts ? (
              products.map((product, index) => (
                <Link
                  key={product.id}
                  to={product.url}
                  prefetch="intent"
                  aria-hidden={index !== activeIndex}
                  tabIndex={index === activeIndex ? 0 : -1}
                  aria-label={product.title}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === activeIndex
                      ? 'z-10 opacity-100'
                      : 'pointer-events-none z-0 opacity-0'
                  }`}
                >
                  {product.image ? (
                    <Image
                      data={product.image}
                      alt={product.image.altText ?? product.title}
                      className="h-full min-h-[430px] w-full rounded-2xl object-cover shadow-[0_28px_80px_rgba(24,21,18,0.12)] ring-1 ring-black/5 sm:min-h-[520px] md:min-h-full"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      sizes="(min-width: 45em) 50vw, 100vw"
                    />
                  ) : null}
                </Link>
              ))
            ) : hero.image?.url ? (
              <Image
                data={hero.image}
                alt={hero.image?.altText ?? 'Lumina skincare'}
                className="relative h-[430px] w-full rounded-2xl object-cover shadow-[0_28px_80px_rgba(24,21,18,0.12)] ring-1 ring-black/5 sm:h-[520px] md:h-full"
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 45em) 50vw, 100vw"
              />
            ) : null}

            {priceText ? (
              <div className="absolute bottom-4 left-4 z-20 max-w-[220px] rounded-xl border border-[var(--color-home-border)] bg-white/95 p-5 shadow-[0_18px_48px_rgba(24,21,18,0.12)] backdrop-blur-sm md:bottom-8 md:left-8">
                <div className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                  {hero.startingFromLabel || 'Starting from'}
                </div>
                <div className="mt-1 text-3xl font-light text-neutral-950">
                  {priceText}
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                  {activeProduct?.title ??
                    'Build a routine with clinically considered formulas.'}
                </p>
              </div>
            ) : null}

            <div className="absolute right-4 top-4 z-20 hidden max-w-[230px] rounded-xl border border-white/70 bg-white/82 p-4 text-sm text-neutral-700 shadow-[0_16px_46px_rgba(24,21,18,0.10)] backdrop-blur md:block">
              <p className="text-[10px] uppercase tracking-[0.14em] text-primary">
                Routine intelligence
              </p>
              <p className="mt-2 leading-relaxed">
                Shop by concern, step, and skin rhythm instead of guessing from a
                shelf.
              </p>
            </div>
          </div>

          {hasProducts && canLoop ? (
            <div
              className="mt-5 flex justify-center gap-2"
              role="tablist"
              aria-label="Choose featured product"
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  goTo(
                    activeIndex <= 0 ? products.length - 1 : activeIndex - 1,
                  );
                } else if (
                  event.key === 'ArrowRight' ||
                  event.key === 'ArrowDown'
                ) {
                  event.preventDefault();
                  goTo((activeIndex + 1) % products.length);
                }
              }}
            >
              {products.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show ${product.title}`}
                  aria-current={index === activeIndex}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
