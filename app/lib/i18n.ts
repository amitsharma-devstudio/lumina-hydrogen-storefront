import {useMatches, useLocation} from 'react-router';
import type {
  CountryCode as CustomerCountryCode,
  LanguageCode as CustomerLanguageCode,
} from '@shopify/hydrogen/customer-account-api-types';
import type {
  CountryCode as StorefrontCountryCode,
  LanguageCode as StorefrontLanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

type LanguageCode = CustomerLanguageCode & StorefrontLanguageCode;
type CountryCode = CustomerCountryCode & StorefrontCountryCode;

export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  pathPrefix: string;
  /** Selector label */
  label: string;
  /** Display currency code (Storefront @inContext sets real Money currency) */
  currency: string;
};

/** Default market — no URL prefix (e.g. `/products`). */
export const DEFAULT_LOCALE: Locale = {
  language: 'EN',
  country: 'US',
  pathPrefix: '/',
  label: 'United States (USD)',
  currency: 'USD',
};

/**
 * Markets aligned with sitemap locales.
 * Default US has no path prefix; others use `/EN-CA`, `/FR-CA`.
 */
export const SUPPORTED_LOCALES: Locale[] = [
  DEFAULT_LOCALE,
  {
    language: 'EN',
    country: 'CA',
    pathPrefix: '/EN-CA',
    label: 'Canada (CAD)',
    currency: 'CAD',
  },
  {
    language: 'FR',
    country: 'CA',
    pathPrefix: '/FR-CA',
    label: 'Canada · Français (CAD)',
    currency: 'CAD',
  },
];

const RE_LOCALE_PREFIX = /^[A-Z]{2}-[A-Z]{2}$/i;

function getFirstPathPart(url: URL): string | null {
  return (
    url.pathname
      .split('/')
      .at(1)
      ?.replace(/\.data$/, '')
      ?.toUpperCase() ?? null
  );
}

export function getLocaleFromRequest(request: Request): Locale {
  const firstPathPart = getFirstPathPart(new URL(request.url));

  if (firstPathPart == null || !RE_LOCALE_PREFIX.test(firstPathPart)) {
    return DEFAULT_LOCALE;
  }

  const pathPrefix = '/' + firstPathPart;
  const known = SUPPORTED_LOCALES.find(
    (locale) => locale.pathPrefix.toUpperCase() === pathPrefix.toUpperCase(),
  );
  if (known) return known;

  type LocaleFromUrl = [Locale['language'], Locale['country']];
  const [language, country] = firstPathPart.split('-') as LocaleFromUrl;
  return {
    language,
    country,
    pathPrefix,
    label: `${language}-${country}`,
    currency: '',
  };
}

export interface WithLocale {
  selectedLocale: Locale;
}

/**
 * Current locale from root loader data.
 */
export function useSelectedLocale(): Locale | null {
  const [root] = useMatches();
  const data = root?.data as WithLocale | undefined;
  return data?.selectedLocale ?? null;
}

/**
 * Pathname without the active locale prefix.
 */
export function getPathWithoutLocale(
  pathname: string,
  selectedLocale: Locale | null,
): string {
  if (!selectedLocale?.pathPrefix || selectedLocale.pathPrefix === '/') {
    return pathname;
  }

  const prefix = selectedLocale.pathPrefix.replace(/\/+$/, '');
  if (pathname.toLowerCase().startsWith(prefix.toLowerCase())) {
    const pathWithoutPrefix = pathname.slice(prefix.length);
    return pathWithoutPrefix.startsWith('/')
      ? pathWithoutPrefix
      : '/' + pathWithoutPrefix;
  }
  return pathname;
}

export function localeMatchesPrefix(localeSegment: string | null): boolean {
  const prefix = '/' + (localeSegment ?? '');
  return SUPPORTED_LOCALES.some(
    (supportedLocale) =>
      supportedLocale.pathPrefix.toUpperCase() === prefix.toUpperCase(),
  );
}

export function normalizePrefix(prefix: string): string {
  return prefix.replace(/\/+$/, '') || '';
}

export function findLocaleByPrefix(path: string): Locale | null {
  const normalizedPath = path.toLowerCase();
  return (
    SUPPORTED_LOCALES.find((locale) => {
      if (locale.pathPrefix === '/') return false;
      return normalizedPath.startsWith(locale.pathPrefix.toLowerCase());
    }) ?? null
  );
}

/**
 * Strip a locale (or stray language) prefix from a path.
 */
export function cleanPath(pathname: string): string {
  const locale = findLocaleByPrefix(pathname);
  if (locale) {
    const prefix = normalizePrefix(locale.pathPrefix);
    return pathname.slice(prefix.length) || '/';
  }

  const match = pathname.match(/^\/[a-z]{2}(-[a-z]{2})?\//i);
  if (match && !findLocaleByPrefix(match[0])) {
    return pathname.slice(match[0].length - 1);
  }

  return pathname;
}

export function localeToHrefLang(locale: Locale): string {
  return `${locale.language.toLowerCase()}-${locale.country.toUpperCase()}`;
}

/**
 * Build absolute alternate URLs for hreflang tags.
 */
export function buildHreflangHrefs(
  pathname: string,
  origin: string,
): {hrefLang: string; href: string}[] {
  const pathWithoutLocale = cleanPath(pathname);
  const base = origin.replace(/\/$/, '');

  function hrefFor(locale: Locale) {
    const prefix = normalizePrefix(locale.pathPrefix);
    if (pathWithoutLocale === '/') {
      return prefix ? `${base}${prefix}` : `${base}/`;
    }
    return `${base}${prefix}${pathWithoutLocale}`;
  }

  const links = SUPPORTED_LOCALES.map((locale) => ({
    hrefLang: localeToHrefLang(locale),
    href: hrefFor(locale),
  }));

  links.push({hrefLang: 'x-default', href: hrefFor(DEFAULT_LOCALE)});
  return links;
}

/**
 * Prefix a path with the active (or explicit) locale.
 */
export function useLocalizedPath(
  to: string,
  locale?: Locale,
  preservePath?: boolean,
): string;
export function useLocalizedPath(
  to: string | object,
  locale?: Locale,
  preservePath?: boolean,
): string | object;
export function useLocalizedPath(
  to: string | object,
  locale?: Locale,
  preservePath = false,
): string | object {
  const currentLocale = useSelectedLocale();
  const {pathname} = useLocation();

  if (typeof to !== 'string') return to;

  if (locale && preservePath) {
    const cleanCurrentPath = cleanPath(pathname);
    return normalizePrefix(locale.pathPrefix) + cleanCurrentPath;
  }

  if (locale) {
    return normalizePrefix(locale.pathPrefix) + to;
  }

  if (findLocaleByPrefix(to)) {
    return to;
  }

  return normalizePrefix(currentLocale?.pathPrefix || '') + to;
}
