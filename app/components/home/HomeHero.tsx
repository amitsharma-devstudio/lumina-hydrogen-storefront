import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {ReactNode} from 'react';
import {HOME_SECTION_MUTED_FLUSH} from '~/components/home/homeSectionStyles';
import {toClientPath, type HeroLink, type HomeHeroData} from '~/lib/homepage';

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
      ? 'inline-flex items-center gap-2 rounded-full !bg-primary px-10 py-4 text-sm font-medium !text-primary-foreground shadow-[0_8px_24px_rgba(184,87,42,0.35)] transition-colors hover:!bg-primary-hover hover:!text-primary-foreground md:px-14'
      : 'inline-flex items-center rounded-full border border-neutral-200 bg-white px-10 py-4 text-sm text-foreground transition-colors hover:border-primary md:px-14';

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
  return (
    <section className={`relative overflow-hidden ${HOME_SECTION_MUTED_FLUSH}`}>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-8 px-6 py-8 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:py-12 lg:min-h-[680px]">
        <div className="order-2 flex flex-col justify-center gap-8 py-4 md:order-1">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
            <span className="text-primary">Lumina</span>
            <span className="h-px w-8 bg-brand-200" aria-hidden />
            <span>Barrier-first skincare</span>
          </div>
          <h1 className="max-w-[11ch] text-[3rem] font-[300] leading-[1.02] text-black sm:text-[3.75rem] md:text-[4.75rem]">
            {hero.headline}
          </h1>
          {hero.subhead ? (
            <p className="max-w-xl text-lg leading-relaxed text-neutral-600 md:text-xl">
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

          <dl className="grid max-w-xl grid-cols-3 border-y border-brand-100 py-5">
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

        <div className="order-1 relative min-h-[430px] md:order-2 md:min-h-full">
          {hero.image?.url ? (
            <Image
              data={hero.image}
              alt={hero.image?.altText ?? 'Lumina skincare'}
              className="h-[430px] w-full rounded-[2rem] object-cover shadow-[0_24px_80px_rgba(28,25,23,0.12)] ring-1 ring-black/5 sm:h-[520px] md:h-full"
              loading="eager"
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          ) : null}

          {hero.startingFromValue ? (
            <div className="absolute bottom-4 left-4 z-10 max-w-[220px] rounded-2xl border border-brand-100 bg-white/95 p-5 shadow-[0_16px_50px_rgba(28,25,23,0.14)] backdrop-blur-sm md:bottom-8 md:left-8">
              <div className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                {hero.startingFromLabel || 'Starting from'}
              </div>
              <div className="mt-1 text-3xl font-light text-neutral-950">
                {hero.startingFromValue}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                Build a routine with clinically considered formulas.
              </p>
            </div>
          ) : null}

          <div className="absolute right-4 top-4 hidden max-w-[230px] rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-neutral-700 shadow-[0_16px_50px_rgba(28,25,23,0.10)] backdrop-blur md:block">
            <p className="text-[10px] uppercase tracking-[0.14em] text-primary">
              Routine intelligence
            </p>
            <p className="mt-2 leading-relaxed">
              Shop by concern, step, and skin rhythm instead of guessing from a
              shelf.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
