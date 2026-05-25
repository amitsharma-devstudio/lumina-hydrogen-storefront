/**
 * Lumina demo store collection handles (Shopify Admin URL slugs).
 * Aliases cover singular/plural titles auto-generated in Admin.
 */
export const STORE_COLLECTION_ORDER = [
  'new-arrivals',
  'cleanser',
  'cleansers',
  'bestseller',
  'bestsellers',
  'moisturizers',
  'serums',
  'hydration',
  'masks',
] as const;

/** Catalog pseudo-collections — hide on the collections index */
export const HIDDEN_COLLECTION_HANDLES = new Set(['all', 'frontpage']);

export const BESTSELLERS_COLLECTION_HANDLE = 'bestsellers';

export const BESTSELLERS_COLLECTION_PATH = `/collections/${BESTSELLERS_COLLECTION_HANDLE}`;

export const BESTSELLERS_HANDLE_CANDIDATES = [
  BESTSELLERS_COLLECTION_HANDLE,
  'bestseller',
] as const;

export const NEW_ARRIVALS_HANDLE_CANDIDATES = [
  'new-arrivals',
  'new',
] as const;

export const HOMEPAGE_CURATED_HANDLE_CANDIDATES = [
  ['cleanser', 'cleansers'],
  ['serums'],
  ['moisturizers'],
  ['masks'],
  ['hydration'],
] as const;

export function resolveCollectionHandle<T extends {handle: string}>(
  byHandle: Map<string, T>,
  candidates: readonly string[],
): T | undefined {
  for (const handle of candidates) {
    const match = byHandle.get(handle);
    if (match) return match;
  }
  return undefined;
}

export function sortStoreCollections<T extends {handle: string}>(
  nodes: T[],
): T[] {
  const byHandle = new Map(nodes.map((c) => [c.handle, c]));
  const ordered: T[] = [];
  const used = new Set<string>();

  for (const handle of STORE_COLLECTION_ORDER) {
    const collection = byHandle.get(handle);
    if (collection && !used.has(collection.handle)) {
      ordered.push(collection);
      used.add(collection.handle);
    }
  }

  for (const collection of nodes) {
    if (!used.has(collection.handle)) {
      ordered.push(collection);
      used.add(collection.handle);
    }
  }

  return ordered;
}

export function filterMerchandisingCollections<T extends {handle: string}>(
  nodes: T[],
): T[] {
  return nodes.filter((c) => !HIDDEN_COLLECTION_HANDLES.has(c.handle));
}
