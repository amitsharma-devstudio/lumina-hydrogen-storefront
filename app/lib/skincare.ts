/** Metaobject node shape from Storefront API (fields array). */
export type MetaobjectNode = {
  id?: string;
  type?: string;
  fields?: Array<{key: string; value?: string | null}>;
  field?: {value?: string | null};
};

export type IngredientDisplay = {
  id: string;
  label: string;
  inci?: string;
  target?: string;
};

export type RoutineStepDisplay = {
  step: number;
  label: string;
  category?: string;
  amPm?: string;
};

export type RegimenDisplay = {
  title: string;
  description: string | null;
  products: RoutineProductCard[];
};

export type SkincareIntelligence = {
  heroClaim: string | null;
  howToUse: string | null;
  fullIngredients: string | null;
  shippingAndReturns: string | null;
  rating: number;
  reviewCount: number;
  ingredients: IngredientDisplay[];
  routine: RoutineStepDisplay | null;
  skinTypes: string[];
  safeWith: string[];
  avoidWith: string[];
  benefits: string[];
  regimen: RegimenDisplay | null;
};

export type RoutineProductCard = {
  id: string;
  handle: string;
  title: string;
  step: string;
  category: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  priceRange?: {
    minVariantPrice: {amount: string; currencyCode: string};
  };
};

function metafieldText(
  metafield: {value?: string | null} | null | undefined,
): string | null {
  const v = metafield?.value;
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

export function getMetaobjectFieldMap(
  node: MetaobjectNode | null | undefined,
): Record<string, string> {
  if (!node) return {};
  const fields = node.fields ?? [];
  const map: Record<string, string> = {};
  for (const f of fields) {
    if (f?.key && f.value) map[f.key] = f.value;
  }
  if (!fields.length && node.field?.value) {
    map.label = node.field.value;
  }
  return map;
}

export function parseLabelFromMetaobject(node: MetaobjectNode): string | null {
  const map = getMetaobjectFieldMap(node);
  return map.label ?? map.name ?? null;
}

export function parseLabelList(
  metafield: {references?: {nodes?: MetaobjectNode[]}} | null | undefined,
): string[] {
  const nodes = metafield?.references?.nodes ?? [];
  return nodes
    .map((n) => parseLabelFromMetaobject(n))
    .filter((l): l is string => Boolean(l));
}

export function parseIngredientList(
  metafield: {references?: {nodes?: MetaobjectNode[]}} | null | undefined,
): IngredientDisplay[] {
  const nodes = metafield?.references?.nodes ?? [];
  return nodes
    .map((node) => {
      const map = getMetaobjectFieldMap(node);
      const label = map.label ?? map.name;
      if (!label || !node.id) return null;
      return {
        id: node.id,
        label,
        inci: map.inci,
        target: map.target,
      };
    })
    .filter((x): x is IngredientDisplay => Boolean(x));
}

export function parseRoutineStep(
  product: {
    step?: {value?: string | null};
    amPm?: {value?: string | null};
    skinCare?: {reference?: MetaobjectNode | null};
  },
): RoutineStepDisplay | null {
  const stepRaw = product.step?.value;
  const step = stepRaw ? Number(stepRaw) : NaN;
  const ref = product.skinCare?.reference;
  const map = getMetaobjectFieldMap(ref ?? undefined);
  const label = map.label;
  if (!Number.isFinite(step) || !label) return null;
  return {
    step,
    label,
    category: map.category,
    amPm: metafieldText(product.amPm) ?? undefined,
  };
}

type RoutineProductNode = {
  id?: string;
  handle?: string;
  title?: string;
  featuredImage?: RoutineProductCard['featuredImage'];
  priceRange?: RoutineProductCard['priceRange'];
  step?: {value?: string | null};
  skinCare?: {reference?: MetaobjectNode | null};
};

function mapRoutineProductNodes(
  nodes: RoutineProductNode[],
): RoutineProductCard[] {
  return nodes
    .map((p, index) => {
      if (!p?.id || !p.handle || !p.title) return null;
      const skinMap = getMetaobjectFieldMap(p.skinCare?.reference ?? undefined);
      const stepNum = p.step?.value
        ? String(p.step.value).padStart(2, '0')
        : String(index + 1).padStart(2, '0');
      const category =
        skinMap.category ?? skinMap.label?.split(' ')[0] ?? 'Step';
      return {
        id: p.id,
        handle: p.handle,
        title: p.title,
        step: stepNum,
        category: category.slice(0, 12),
        featuredImage: p.featuredImage ?? null,
        priceRange: p.priceRange,
      };
    })
    .filter((x): x is RoutineProductCard => Boolean(x));
}

/** Per-product override list (legacy / one-off routines). */
export function parseRoutineProducts(
  metafield: {references?: {nodes?: RoutineProductNode[]}} | null | undefined,
): RoutineProductCard[] {
  return mapRoutineProductNodes(metafield?.references?.nodes ?? []);
}

const REGIMEN_PRODUCT_FIELD_KEYS = ['products', 'routine_products', 'steps'];

/**
 * Shared regimen metaobject (`lumina_regimen`).
 * Field `products` = ordered list of product references.
 */
export function parseRegimen(
  metafield: {
    reference?: {
      id?: string;
      fields?: Array<{
        key: string;
        value?: string | null;
        references?: {nodes?: RoutineProductNode[]};
      }>;
    } | null;
  } | null | undefined,
): RegimenDisplay | null {
  const ref = metafield?.reference;
  if (!ref?.fields?.length) return null;

  const map = getMetaobjectFieldMap(ref as MetaobjectNode);
  const title = map.title ?? map.name ?? 'The Lumina Regimen';
  const description = map.description ?? map.subtitle ?? null;

  const productsField = ref.fields.find((f) =>
    REGIMEN_PRODUCT_FIELD_KEYS.includes(f.key),
  );
  const products = mapRoutineProductNodes(
    productsField?.references?.nodes ?? [],
  );

  if (!products.length) return null;

  return {title, description, products};
}

export function resolveRegimen(product: {
  regimen?: Parameters<typeof parseRegimen>[0];
  routineProducts?: Parameters<typeof parseRoutineProducts>[0];
}): RegimenDisplay | null {
  return (
    parseRegimen(product.regimen) ??
    (() => {
      const products = parseRoutineProducts(product.routineProducts);
      if (!products.length) return null;
      return {
        title: 'Complete your routine',
        description: null,
        products,
      };
    })()
  );
}

export function buildSkincareIntelligence(product: any): SkincareIntelligence {
  const rating = product?.rating?.value
    ? parseFloat(String(product.rating.value))
    : 0;
  const reviewCount = product?.reviewCount?.value
    ? parseInt(String(product.reviewCount.value), 10)
    : 0;

  return {
    heroClaim: metafieldText(product?.heroClaim),
    howToUse: metafieldText(product?.howToUse),
    fullIngredients: metafieldText(product?.fullIngredients),
    shippingAndReturns: metafieldText(product?.shippingAndReturns),
    rating: Number.isFinite(rating) ? rating : 0,
    reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
    ingredients: parseIngredientList(product?.ingredients),
    routine: parseRoutineStep(product),
    skinTypes: parseLabelList(product?.skinTypes),
    safeWith: parseLabelList(product?.safeWith),
    avoidWith: parseLabelList(product?.avoidWith),
    benefits: parseLabelList(product?.productBenefits),
    regimen: resolveRegimen(product),
  };
}

/** Split "AM & PM" or "AM, PM" into pill labels. */
export function parseAmPmPills(value: string | null | undefined): string[] {
  if (!value) return [];
  if (value.includes('&')) {
    return value.split('&').map((s) => s.trim()).filter(Boolean);
  }
  if (value.includes(',')) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [value.trim()];
}
