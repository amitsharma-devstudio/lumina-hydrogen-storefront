type SeoImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type BuildSeoMetaInput = {
  title: string;
  description?: string | null;
  /** Absolute or site-relative path (e.g. `/products/serum`). */
  url?: string | null;
  /** Origin used to absolutize relative URLs (e.g. `https://lumina.example`). */
  origin?: string | null;
  image?: SeoImage | null;
  type?: 'website' | 'product' | 'article';
  noIndex?: boolean;
};

export type SeoMetaDescriptor =
  | {title: string}
  | {name: string; content: string}
  | {property: string; content: string}
  | {rel: 'canonical'; href: string};

function absolutize(url: string | null | undefined, origin?: string | null) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (!origin) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${origin.replace(/\/$/, '')}${path}`;
}

/**
 * Shared title / description / canonical / Open Graph / Twitter meta tags.
 */
export function buildSeoMeta({
  title,
  description,
  url,
  origin,
  image,
  type = 'website',
  noIndex = false,
}: BuildSeoMetaInput): SeoMetaDescriptor[] {
  const absoluteUrl = absolutize(url, origin);
  const absoluteImage = absolutize(image?.url, origin);
  const tags: SeoMetaDescriptor[] = [{title}];

  if (description) {
    tags.push({name: 'description', content: description});
  }

  if (absoluteUrl) {
    tags.push({rel: 'canonical', href: absoluteUrl});
    tags.push({property: 'og:url', content: absoluteUrl});
  }

  tags.push(
    {property: 'og:site_name', content: 'Lumina'},
    {property: 'og:type', content: type},
    {property: 'og:title', content: title},
    {name: 'twitter:card', content: absoluteImage ? 'summary_large_image' : 'summary'},
    {name: 'twitter:title', content: title},
  );

  if (description) {
    tags.push(
      {property: 'og:description', content: description},
      {name: 'twitter:description', content: description},
    );
  }

  if (absoluteImage) {
    tags.push(
      {property: 'og:image', content: absoluteImage},
      {name: 'twitter:image', content: absoluteImage},
    );
    if (image?.altText) {
      tags.push({property: 'og:image:alt', content: image.altText});
    }
    if (image?.width) {
      tags.push({property: 'og:image:width', content: String(image.width)});
    }
    if (image?.height) {
      tags.push({property: 'og:image:height', content: String(image.height)});
    }
  }

  if (noIndex) {
    tags.push({name: 'robots', content: 'noindex, nofollow'});
  }

  return tags;
}

export function getRequestOrigin(request: Request) {
  const url = new URL(request.url);
  return url.origin;
}

export function languageToHtmlLang(language?: string | null) {
  if (!language) return 'en';
  return language.toLowerCase().split(/[_-]/)[0] || 'en';
}
