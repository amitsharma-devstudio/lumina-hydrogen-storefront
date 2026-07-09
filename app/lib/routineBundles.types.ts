import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

export type RoutineStepType = 'Cleanse' | 'Treat' | 'Moisturize';

export type RoutineProductPrice = {
  amount: string;
  currencyCode: CurrencyCode;
};

export type RoutineProductOption = {
  productTitle: string;
  productHandle: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  price?: RoutineProductPrice | null;
  /** First variant's merchandise id — used to add the routine to the cart. */
  variantId?: string | null;
  availableForSale?: boolean;
};

export type RoutineBundleStep = {
  label: string;
  step: RoutineStepType;
  note: string;
  options: RoutineProductOption[];
};

export type RoutineBundle = {
  id: string;
  handle: string;
  bundleKey: string;
  goal: string;
  eyebrow: string;
  title: string;
  description: string;
  bestFor: string;
  result: string;
  price: string;
  collectionPath: string;
  ctaLabel: string;
  palette: string;
  sortOrder: number;
  steps: RoutineBundleStep[];
};

export const ROUTINE_STEP_TYPES: RoutineStepType[] = [
  'Cleanse',
  'Treat',
  'Moisturize',
];

export const ROUTINE_THEME_PALETTES: Record<string, string> = {
  glow: 'from-[#f7e2d2] via-[#fff7ef] to-white',
  barrier: 'from-[#dfe8dd] via-[#f7faf5] to-white',
  clarity: 'from-[#dde7ea] via-[#f5fafb] to-white',
  renewal: 'from-[#e5dff1] via-[#faf7ff] to-white',
};

export function paletteForTheme(theme: string | null | undefined): string {
  if (!theme) return ROUTINE_THEME_PALETTES.glow;
  return ROUTINE_THEME_PALETTES[theme] ?? ROUTINE_THEME_PALETTES.glow;
}

export function defaultSelectionForSteps(
  steps: RoutineBundleStep[],
): string[] {
  return steps.map((step) => step.options[0]?.productHandle ?? '');
}
