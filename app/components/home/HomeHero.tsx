import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {ReactNode} from 'react';
import {toClientPath} from '~/lib/homepage';

import type {HeroLink, HomeHeroData} from '~/lib/homepage';

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
      ? 'inline-flex items-center gap-2 rounded-full !bg-black px-16 py-4 text-sm !text-white hover:!text-white transition-opacity hover:opacity-80'
      : 'inline-flex items-center rounded-full border border-neutral-200 bg-white px-16 py-4 text-sm text-black transition-colors hover:border-black';

  // Shopify metaobject URL fields require absolute URLs (Option B).
  // We still prefer client-side routing for internal links when possible.
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

export function HomeHero({hero}: {hero?: HomeHeroData}) {
  return (
    <section className="bg-white pt-6 md:pt-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-6 py-6 md:grid-cols-2 md:gap-16 md:py-8">
        <div className="order-2 flex flex-col gap-8 md:order-1">
          {hero?.headline ? (
            <h1 className="max-w-[12ch] text-[3.25rem] font-[300] leading-[1.02] tracking-[-0.03em] text-black sm:text-[4rem] md:text-[5rem]">
              {hero.headline}
            </h1>
          ) : null}

          {hero?.subhead ? (
            <p className="max-w-xl overflow-hidden text-lg leading-relaxed text-neutral-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] md:text-xl">
              {hero.subhead}
            </p>
          ) : null}

          <div className="flex flex-col items-start gap-3">
            {hero?.primaryCta?.url ? (
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

            {hero?.secondaryCta?.url ? (
              <Cta link={hero.secondaryCta} variant="secondary">
                {hero.secondaryCta.label || 'Our Story'}
              </Cta>
            ) : null}
          </div>
        </div>

        <div className="order-1 relative md:order-2">
          {hero?.image ? (
            <Image
              data={hero.image}
              alt={hero.image?.altText ?? 'Skincare'}
              className="h-[440px] w-full rounded-2xl object-cover sm:h-[520px] md:h-[600px]"
              loading="eager"
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          ) : (
            <div className="aspect-[4/5] w-full max-h-[600px] rounded-2xl bg-neutral-100 md:aspect-[3/4]" />
          )}

          {hero?.startingFromValue ? (
            <div className="absolute bottom-4 left-4 z-10 rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.10)] md:-bottom-6 md:-left-6">
              <div className="text-xs text-neutral-500">
                {hero.startingFromLabel || 'Starting from'}
              </div>
              <div className="mt-1 text-3xl font-light tracking-tight text-black">
                {hero.startingFromValue}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

