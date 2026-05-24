import type {HomeHeroData, HeroLink} from '~/lib/homepage';

/** Static promo assets: `public/images/home/promo-{1,2,3}.jpg` */
const HOME_PROMO_ASSET = (filename: string) => `/images/home/${filename}`;

export type HomePromoSlide = {
  id: string;
  title: string;
  subtitle?: string | null;
  cta?: HeroLink;
  image: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  };
};

/** Premium fallback hero when `home_hero` metaobject is missing in Admin. */
export const FALLBACK_HOME_HERO: NonNullable<HomeHeroData> = {
  headline: 'Radiance, engineered for your skin',
  subhead:
    'Clinical-grade actives and clean formulas—curated for brightening, hydration, and everyday glow.',
  primaryCta: {
    label: 'Shop the collection',
    url: '/collections/all',
  },
  secondaryCta: {
    label: 'Explore serums',
    url: '/collections/serums',
  },
  startingFromLabel: 'Starting from',
  startingFromValue: '$32',
  image: {
    url: 'https://images.unsplash.com/photo-1570175171328-9fa88981ac10?auto=format&fit=crop&w=1400&q=85',
    altText: 'Woman applying Lumina skincare serum',
    width: 1400,
    height: 1750,
  },
};

/** Looping promo slides when `home_promo_banner` metaobjects are missing. */
export const FALLBACK_HOME_PROMO_SLIDES: HomePromoSlide[] = [
  {
    id: 'fallback-promo-1',
    title: 'New season, new glow',
    subtitle: 'Discover vitamin-rich serums and overnight treatments.',
    cta: {label: 'Shop new arrivals', url: '/collections/new-arrivals'},
    image: {
      url: HOME_PROMO_ASSET('promo-1.jpg'),
      altText: 'New season skincare collection',
      width: 1600,
      height: 900,
    },
  },
  {
    id: 'fallback-promo-2',
    title: 'Free shipping over $75',
    subtitle: 'Complimentary delivery on every routine-building order.',
    cta: {label: 'Build your routine', url: '/collections/all'},
    image: {
      url: HOME_PROMO_ASSET('promo-2.jpg'),
      altText: 'Lumina skincare flat lay',
      width: 1600,
      height: 900,
    },
  },
  {
    id: 'fallback-promo-3',
    title: 'Bestsellers, back in stock',
    subtitle: 'Fan-favorite cleansers and moisturizers—limited quantities.',
    cta: {label: 'Shop bestsellers', url: '/collections/bestseller'},
    image: {
      url: HOME_PROMO_ASSET('promo-3.jpg'),
      altText: 'Bestselling moisturizers and serums',
      width: 1600,
      height: 900,
    },
  },
];

export function isHeroEmpty(hero: HomeHeroData): boolean {
  if (!hero) return true;
  return !hero.headline?.trim() && !hero.image?.url;
}

/** CMS hero when present; otherwise premium hardcoded fallback. */
export function resolveHomeHero(hero: HomeHeroData): NonNullable<HomeHeroData> {
  if (isHeroEmpty(hero)) return FALLBACK_HOME_HERO;

  const fb = FALLBACK_HOME_HERO;
  return {
    headline: hero?.headline?.trim() || fb.headline,
    subhead: hero?.subhead?.trim() || fb.subhead,
    primaryCta: hero?.primaryCta?.url ? hero.primaryCta : fb.primaryCta,
    secondaryCta: hero?.secondaryCta?.url ? hero.secondaryCta : fb.secondaryCta,
    startingFromLabel: hero?.startingFromLabel || fb.startingFromLabel,
    startingFromValue: hero?.startingFromValue || fb.startingFromValue,
    image: hero?.image?.url ? hero.image : fb.image,
  };
}

export function resolveHomePromoSlides(
  slides: HomePromoSlide[],
): HomePromoSlide[] {
  return slides.length > 0 ? slides : FALLBACK_HOME_PROMO_SLIDES;
}
