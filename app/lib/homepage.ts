export type MetaobjectField = {
  key: string;
  value?: string | null;
  reference?: any;
  references?: any;
};

export type HeroLink = {label?: string | null; url?: string | null} | null;

export type HeroProduct = {
  id: string;
  handle: string;
  title: string;
  url: string;
  image: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  priceText: string | null;
};

export type HomeHeroData = {
  headline?: string | null;
  subhead?: string | null;
  primaryCta?: HeroLink;
  secondaryCta?: HeroLink;
  startingFromLabel?: string | null;
  startingFromValue?: string | null;
  image?: any | null;
  products?: HeroProduct[];
} | null;

export function getMetaobjectField(
  fields: MetaobjectField[],
  key: string,
): MetaobjectField | undefined {
  return fields.find((f) => f.key === key);
}

export function getMetaobjectText(
  fields: MetaobjectField[],
  key: string,
): string | null {
  return getMetaobjectField(fields, key)?.value ?? null;
}

export function parseMetaobjectLink(
  raw: string | null,
): {url: string | null; text: string | null} | null {
  if (!raw) return null;
  try {
    const parsed: any = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const url =
        typeof parsed.url === 'string'
          ? parsed.url
          : typeof parsed.href === 'string'
            ? parsed.href
            : typeof parsed.destination === 'string'
              ? parsed.destination
              : null;
      const text =
        typeof parsed.text === 'string'
          ? parsed.text
          : typeof parsed.label === 'string'
            ? parsed.label
            : typeof parsed.title === 'string'
              ? parsed.title
              : typeof parsed.anchorText === 'string'
                ? parsed.anchorText
                : null;
      if (url || text) return {url, text};
    }
  } catch {
    // ignore
  }
  return null;
}

export function parseMetaobjectMoney(
  raw: string | null,
  locale?: string,
): string | null {
  if (!raw) return null;
  try {
    const parsed: any = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.amount === 'string' &&
      (typeof parsed.currency_code === 'string' ||
        typeof parsed.currencyCode === 'string')
    ) {
      const amount = Number(parsed.amount);
      if (!Number.isFinite(amount)) return null;
      const currency =
        typeof parsed.currency_code === 'string'
          ? parsed.currency_code
          : parsed.currencyCode;
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    }
  } catch {
    // ignore
  }
  return null;
}

export function extractImageFromMetaobjectField(
  field: MetaobjectField | undefined,
): any | null {
  if (!field) return null;
  return field.reference?.image ?? field.reference ?? null;
}

export type HomePromoSlide = {
  id: string;
  title: string;
  subtitle?: string | null;
  cta?: HeroLink;
  image?: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
};

export function isHeroEmpty(hero: HomeHeroData): boolean {
  if (!hero) return true;
  return !hero.headline?.trim() && !hero.image?.url;
}

export function buildHomePromoBannerData(args: {
  id: string;
  fields: MetaobjectField[];
  imageKey?: string;
}): HomePromoSlide | null {
  const {id, fields, imageKey = 'image'} = args;
  const title = getMetaobjectText(fields, 'title') ?? getMetaobjectText(fields, 'headline');
  if (!title?.trim()) return null;

  const ctaLink = parseMetaobjectLink(
    getMetaobjectText(fields, 'cta_url') ?? getMetaobjectText(fields, 'link'),
  );
  const image = extractImageFromMetaobjectField(getMetaobjectField(fields, imageKey));

  const subtitle =
    getMetaobjectText(fields, 'subtitle') ?? getMetaobjectText(fields, 'subhead');
  return {
    id,
    title: title.trim(),
    subtitle,
    cta: ctaLink?.url
      ? {label: ctaLink.text ?? 'Shop now', url: ctaLink.url}
      : null,
    image: image?.url
      ? {
          url: image.url,
          altText: image.altText,
          width: image.width,
          height: image.height,
        }
      : null,
  };
}

function formatMoneyAmount(
  amount?: string | null,
  currencyCode?: string | null,
  locale?: string,
): string | null {
  if (!amount || !currencyCode) return null;
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return null;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return null;
  }
}

/**
 * Flattens the `hero_products` field (a list of `product_hero` metaobjects, each
 * wrapping a single Product reference) into carousel-ready slides. Products
 * without a resolvable image are dropped since the hero slide is image-first.
 */
export function buildHeroProducts(
  fields: MetaobjectField[],
  locale?: string,
): HeroProduct[] {
  const nodes: any[] =
    getMetaobjectField(fields, 'hero_products')?.references?.nodes ?? [];

  const products: HeroProduct[] = [];

  for (const node of nodes) {
    const productField = (node?.fields ?? []).find(
      (f: any) => f?.key === 'product',
    );
    const product = productField?.reference;
    if (!product?.handle) continue;

    const image = product.featuredImage;
    const price = product.priceRange?.minVariantPrice;

    products.push({
      id: product.id,
      handle: product.handle,
      title: product.title ?? product.handle,
      url: `/products/${product.handle}`,
      image: image?.url
        ? {
            url: image.url,
            altText: image.altText,
            width: image.width,
            height: image.height,
          }
        : null,
      priceText: formatMoneyAmount(price?.amount, price?.currencyCode, locale),
    });
  }

  return products.filter((product) => product.image);
}

export function buildHomeHeroData(args: {
  fields: MetaobjectField[];
  locale?: string;
  imageKey?: string;
}): HomeHeroData {
  const {fields, locale, imageKey = 'image'} = args;

  const primaryLink = parseMetaobjectLink(getMetaobjectText(fields, 'primary_cta_url'));
  const secondaryLink = parseMetaobjectLink(getMetaobjectText(fields, 'secondary_cta_url'));

  const startingFromValueRaw = getMetaobjectText(fields, 'starting_from_value');
  const startingFromValue =
    parseMetaobjectMoney(startingFromValueRaw, locale) ?? startingFromValueRaw;

  return {
    headline: getMetaobjectText(fields, 'headline'),
    subhead: getMetaobjectText(fields, 'subhead'),
    primaryCta: {label: primaryLink?.text ?? null, url: primaryLink?.url ?? null},
    secondaryCta: {label: secondaryLink?.text ?? null, url: secondaryLink?.url ?? null},
    startingFromLabel: getMetaobjectText(fields, 'starting_from_label'),
    startingFromValue,
    image: extractImageFromMetaobjectField(getMetaobjectField(fields, imageKey)),
    products: buildHeroProducts(fields, locale),
  };
}

/** Turn Shopify Admin URLs into in-app paths (e.g. myshopify.com/collections/x → /collections/x) */
export function toClientPath(href: string | null | undefined): string | null {
  if (!href) return null;
  try {
    const u = new URL(href);
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return href.startsWith('/') ? href : null;
  }
}

