import type {Storefront} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartRegimenProductsQuery} from '~/graphql/queries/CartRegimenProductsQuery';
import {BestsellersProductsQuery} from '~/graphql/queries/BestsellersProductsQuery';
import {
  getMetaobjectFieldMap,
  parseRegimen,
  parseRoutineProducts,
  type RoutineProductCard,
} from '~/lib/skincare';
import {BESTSELLERS_HANDLE_CANDIDATES} from '~/lib/storeCollections';

export type CartUpsellItem = RoutineProductCard & {
  variantId: string;
  availableForSale: boolean;
  source: 'regimen' | 'bestseller';
};

export type CartUpsells = {
  title: string;
  description: string | null;
  items: CartUpsellItem[];
};

const EMPTY_UPSELLS: CartUpsells = {
  title: '',
  description: null,
  items: [],
};

const REGIMEN_PRODUCT_FIELD_KEYS = ['products', 'routine_products', 'steps'];

type UpsellProductNode = {
  id?: string;
  handle?: string;
  title?: string;
  featuredImage?: RoutineProductCard['featuredImage'];
  priceRange?: RoutineProductCard['priceRange'];
  step?: {value?: string | null};
  skinCare?: {
    reference?: {
      fields?: Array<{key: string; value?: string | null}>;
    } | null;
  };
  selectedOrFirstAvailableVariant?: {
    id?: string;
    availableForSale?: boolean;
  } | null;
};

type RegimenCartNode = {
  regimen?: Parameters<typeof parseRegimen>[0];
  routineProducts?: Parameters<typeof parseRoutineProducts>[0];
};

function getCartProductIds(cart: CartApiQueryFragment | null): string[] {
  const ids = new Set<string>();
  for (const line of cart?.lines?.nodes ?? []) {
    const productId = line.merchandise?.product?.id;
    if (productId) ids.add(productId);
  }
  return [...ids];
}

function getCartHandles(cart: CartApiQueryFragment | null): Set<string> {
  const handles = new Set<string>();
  for (const line of cart?.lines?.nodes ?? []) {
    const handle = line.merchandise?.product?.handle;
    if (handle) handles.add(handle);
  }
  return handles;
}

function toUpsellItem(
  product: UpsellProductNode,
  source: CartUpsellItem['source'],
): CartUpsellItem | null {
  const variantId = product.selectedOrFirstAvailableVariant?.id;
  if (!product.id || !product.handle || !product.title || !variantId) return null;

  const skinMap = getMetaobjectFieldMap(
    product.skinCare?.reference as Parameters<typeof getMetaobjectFieldMap>[0],
  );
  const stepNum = product.step?.value
    ? String(product.step.value).padStart(2, '0')
    : '01';
  const category =
    skinMap.category ?? skinMap.label?.split(' ')[0] ?? 'Step';

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    step: stepNum,
    category: category.slice(0, 12),
    featuredImage: product.featuredImage ?? null,
    priceRange: product.priceRange,
    variantId,
    availableForSale:
      product.selectedOrFirstAvailableVariant?.availableForSale ?? true,
    source,
  };
}

function extractRegimenProductNodes(node: RegimenCartNode): UpsellProductNode[] {
  const products: UpsellProductNode[] = [];
  const ref = node.regimen?.reference;
  if (ref?.fields) {
    for (const field of ref.fields) {
      if (!REGIMEN_PRODUCT_FIELD_KEYS.includes(field.key)) continue;
      for (const refNode of field.references?.nodes ?? []) {
        products.push(refNode as UpsellProductNode);
      }
    }
  }

  for (const refNode of node.routineProducts?.references?.nodes ?? []) {
    products.push(refNode as UpsellProductNode);
  }

  return products;
}

function collectRegimenUpsells(
  nodes: RegimenCartNode[],
  cartHandles: Set<string>,
): {title: string; description: string | null; products: UpsellProductNode[]} {
  let title = 'Complete your routine';
  let description: string | null =
    'Add the remaining steps from this regimen to finish your ritual.';
  const seenHandles = new Set<string>();
  const products: UpsellProductNode[] = [];

  for (const node of nodes) {
    const regimen =
      parseRegimen(node.regimen) ??
      (() => {
        const routineProducts = parseRoutineProducts(node.routineProducts);
        if (!routineProducts.length) return null;
        return {
          title: 'Complete your routine',
          description: null,
          products: routineProducts,
        };
      })();

    if (regimen) {
      title = regimen.title;
      if (regimen.description) description = regimen.description;
    }

    for (const product of extractRegimenProductNodes(node)) {
      if (
        !product.handle ||
        cartHandles.has(product.handle) ||
        seenHandles.has(product.handle)
      ) {
        continue;
      }
      seenHandles.add(product.handle);
      products.push(product);
    }
  }

  return {title, description, products};
}

async function loadBestsellerUpsells(
  storefront: Storefront,
  cartHandles: Set<string>,
  limit: number,
): Promise<CartUpsellItem[]> {
  for (const handle of BESTSELLERS_HANDLE_CANDIDATES) {
    const response = await storefront.query(BestsellersProductsQuery, {
      variables: {handle},
    });
    const nodes = response?.collection?.products?.nodes ?? [];
    if (!nodes.length) continue;

    const items: CartUpsellItem[] = [];
    for (const node of nodes) {
      if (!node?.handle || cartHandles.has(node.handle)) continue;
      const mapped = toUpsellItem(node as UpsellProductNode, 'bestseller');
      if (mapped?.availableForSale) items.push(mapped);
      if (items.length >= limit) break;
    }
    if (items.length) return items;
  }
  return [];
}

export async function loadCartUpsells({
  storefront,
  cart,
}: {
  storefront: Storefront;
  cart: CartApiQueryFragment | null;
}): Promise<CartUpsells> {
  const cartHandles = getCartHandles(cart);
  if (!cartHandles.size) return EMPTY_UPSELLS;

  const productIds = getCartProductIds(cart);
  if (!productIds.length) return EMPTY_UPSELLS;

  const response = await storefront.query(CartRegimenProductsQuery, {
    variables: {ids: productIds},
  });

  const nodes = (response?.nodes ?? []).filter(Boolean) as RegimenCartNode[];

  const {title, description, products} = collectRegimenUpsells(
    nodes,
    cartHandles,
  );

  let items = products
    .map((product) => toUpsellItem(product, 'regimen'))
    .filter((item): item is CartUpsellItem => Boolean(item))
    .filter((item) => item.availableForSale)
    .slice(0, 4);

  if (!items.length) {
    items = await loadBestsellerUpsells(storefront, cartHandles, 4);
    if (!items.length) return EMPTY_UPSELLS;

    return {
      title: 'You might also like',
      description: 'Customers often pair these formulas with their cart.',
      items,
    };
  }

  return {
    title,
    description,
    items,
  };
}
