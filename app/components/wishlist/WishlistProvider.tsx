import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {useFetcher} from 'react-router';
import {useLocalizedPath} from '~/lib/i18n';
import {
  clearLocalWishlist,
  isInWishlist,
  mergeWishlistItems,
  readLocalWishlist,
  removeWishlistItem,
  upsertWishlistItem,
  writeLocalWishlist,
  type WishlistItem,
} from '~/lib/wishlist';

type WishlistContextValue = {
  items: WishlistItem[];
  ready: boolean;
  loggedIn: boolean;
  has: (productId: string) => boolean;
  toggle: (item: Omit<WishlistItem, 'addedAt'> & {addedAt?: string}) => void;
  remove: (productId: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

type ApiLoaderData = {
  loggedIn: boolean;
  items: WishlistItem[];
};

type ApiActionData = {
  ok: boolean;
  error?: string | null;
  items: WishlistItem[];
};

export function WishlistProvider({
  isLoggedIn,
  children,
}: {
  isLoggedIn: Promise<boolean>;
  children: ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);
  const apiPath = useLocalizedPath('/api/wishlist');
  const loadFetcher = useFetcher<ApiLoaderData>();
  const actionFetcher = useFetcher<ApiActionData>();

  // Resolve auth + seed from localStorage, then hydrate from server when logged in
  useEffect(() => {
    let cancelled = false;
    const local = readLocalWishlist();
    setItems(local);

    void isLoggedIn.then((value) => {
      if (cancelled) return;
      setLoggedIn(value);
      if (value) {
        loadFetcher.load(apiPath);
      } else {
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per mount / locale path
  }, [apiPath, isLoggedIn]);

  useEffect(() => {
    if (loadFetcher.state !== 'idle' || !loadFetcher.data) return;
    const serverItems = loadFetcher.data.items ?? [];
    const local = readLocalWishlist();
    const merged = mergeWishlistItems(serverItems, local);
    setItems(merged);
    writeLocalWishlist(merged);
    setLoggedIn(Boolean(loadFetcher.data.loggedIn));
    setReady(true);

    // Persist guest items into the customer metafield after login
    if (
      loadFetcher.data.loggedIn &&
      local.length > 0 &&
      serializeDiffers(serverItems, merged)
    ) {
      const form = new FormData();
      form.set('intent', 'merge');
      form.set('items', JSON.stringify(local));
      actionFetcher.submit(form, {method: 'POST', action: apiPath});
      clearLocalWishlist();
      writeLocalWishlist(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFetcher.state, loadFetcher.data, apiPath]);

  useEffect(() => {
    if (actionFetcher.state !== 'idle' || !actionFetcher.data?.ok) return;
    if (actionFetcher.data.items) {
      setItems(actionFetcher.data.items);
      writeLocalWishlist(actionFetcher.data.items);
    }
  }, [actionFetcher.state, actionFetcher.data]);

  const persist = useCallback(
    (next: WishlistItem[], intent: 'toggle' | 'remove', product?: WishlistItem) => {
      setItems(next);
      writeLocalWishlist(next);

      if (!loggedIn) return;

      const form = new FormData();
      form.set('intent', intent);
      if (intent === 'toggle' && product) {
        form.set('productId', product.id);
        form.set('handle', product.handle);
        form.set('title', product.title);
        if (product.imageUrl) form.set('imageUrl', product.imageUrl);
        if (product.imageAlt) form.set('imageAlt', product.imageAlt);
      } else if (intent === 'remove' && product) {
        form.set('productId', product.id);
      }
      actionFetcher.submit(form, {method: 'POST', action: apiPath});
    },
    [actionFetcher, apiPath, loggedIn],
  );

  const toggle = useCallback(
    (item: Omit<WishlistItem, 'addedAt'> & {addedAt?: string}) => {
      const exists = isInWishlist(items, item.id);
      const entry: WishlistItem = {
        ...item,
        addedAt: item.addedAt ?? new Date().toISOString(),
      };
      const next = exists
        ? removeWishlistItem(items, item.id)
        : upsertWishlistItem(items, entry);
      persist(next, 'toggle', entry);
    },
    [items, persist],
  );

  const remove = useCallback(
    (productId: string) => {
      const existing = items.find((item) => item.id === productId);
      const next = removeWishlistItem(items, productId);
      persist(next, 'remove', existing);
    },
    [items, persist],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      ready,
      loggedIn,
      has: (productId: string) => isInWishlist(items, productId),
      toggle,
      remove,
    }),
    [items, ready, loggedIn, toggle, remove],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

function serializeDiffers(a: WishlistItem[], b: WishlistItem[]) {
  const idsA = a.map((item) => item.id).sort().join('|');
  const idsB = b.map((item) => item.id).sort().join('|');
  return idsA !== idsB;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return ctx;
}

/** Safe for components that may render outside the provider during SSR fallbacks. */
export function useWishlistOptional() {
  return useContext(WishlistContext);
}
