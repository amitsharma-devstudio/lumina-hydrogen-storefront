export type MetaobjectField = {
  key: string;
  value?: string | null;
  reference?: any;
};

export type HeroLink = {label?: string | null; url?: string | null} | null;

export type HomeHeroData = {
  headline?: string | null;
  subhead?: string | null;
  primaryCta?: HeroLink;
  secondaryCta?: HeroLink;
  startingFromLabel?: string | null;
  startingFromValue?: string | null;
  image?: any | null;
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
  };
}

export function toClientPath(href: string | null | undefined): string | null {
  if (!href) return null;
  try {
    const u = new URL(href);
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return href.startsWith('/') ? href : null;
  }
}

