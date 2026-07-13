export const WISHLIST_STORAGE_KEY = 'lumina:wishlist';
export const WISHLIST_NAMESPACE = 'lumina';
export const WISHLIST_KEY = 'wishlist';
export const WISHLIST_METAFIELD_TYPE = 'json';

export type WishlistItem = {
  id: string;
  handle: string;
  title: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  addedAt: string;
};

export function parseWishlistValue(value: string | null | undefined): WishlistItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is WishlistItem =>
          Boolean(
            item &&
              typeof item === 'object' &&
              typeof (item as WishlistItem).id === 'string' &&
              typeof (item as WishlistItem).handle === 'string' &&
              typeof (item as WishlistItem).title === 'string',
          ),
      )
      .map((item) => ({
        id: item.id,
        handle: item.handle,
        title: item.title,
        imageUrl: item.imageUrl ?? null,
        imageAlt: item.imageAlt ?? null,
        addedAt:
          typeof item.addedAt === 'string' ? item.addedAt : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export function serializeWishlist(items: WishlistItem[]): string {
  return JSON.stringify(items);
}

export function readLocalWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return parseWishlistValue(window.localStorage.getItem(WISHLIST_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function writeLocalWishlist(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, serializeWishlist(items));
  } catch {
    // quota / private mode — ignore
  }
}

export function clearLocalWishlist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function upsertWishlistItem(
  items: WishlistItem[],
  item: Omit<WishlistItem, 'addedAt'> & {addedAt?: string},
): WishlistItem[] {
  const without = items.filter((existing) => existing.id !== item.id);
  return [
    {
      ...item,
      addedAt: item.addedAt ?? new Date().toISOString(),
    },
    ...without,
  ];
}

export function removeWishlistItem(
  items: WishlistItem[],
  productId: string,
): WishlistItem[] {
  return items.filter((item) => item.id !== productId);
}

export function isInWishlist(items: WishlistItem[], productId: string): boolean {
  return items.some((item) => item.id === productId);
}

/** Merge by product id; keep the most recently added entry. */
export function mergeWishlistItems(
  primary: WishlistItem[],
  secondary: WishlistItem[],
): WishlistItem[] {
  const map = new Map<string, WishlistItem>();
  for (const item of [...secondary, ...primary]) {
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
      continue;
    }
    const newer =
      Date.parse(item.addedAt) >= Date.parse(existing.addedAt) ? item : existing;
    map.set(item.id, newer);
  }
  return Array.from(map.values()).sort(
    (a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt),
  );
}
