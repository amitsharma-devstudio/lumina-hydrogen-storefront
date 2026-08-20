const UPPERCASE_WORDS = new Set(['faq']);

/** Turn a URL handle (e.g. `privacy-policy`) into a readable title (`Privacy Policy`). */
export function titleFromHandle(handle: string) {
  return handle
    .split('-')
    .filter(Boolean)
    .map((word) => {
      if (UPPERCASE_WORDS.has(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

type PlaceholderPageContent = {
  title: string;
  description?: string;
};

/** Demo info pages that share the same Coming Soon layout with page-specific titles. */
const PLACEHOLDER_PAGES: Record<string, PlaceholderPageContent> = {
  about: {title: 'About Us'},
  contact: {title: 'Contact'},
  faq: {title: 'FAQ'},
  'privacy-policy': {title: 'Privacy Policy'},
};

export function getPlaceholderPageContent(
  handle: string,
): PlaceholderPageContent | null {
  return PLACEHOLDER_PAGES[handle] ?? null;
}

export function getPlaceholderPageTitle(handle: string) {
  return getPlaceholderPageContent(handle)?.title ?? titleFromHandle(handle);
}
