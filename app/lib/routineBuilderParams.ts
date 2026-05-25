import type {RoutineStepType} from '~/lib/routineBundles.types';

export const ROUTINE_BUILDER_STEP_KEYS = [
  'cleanse',
  'treat',
  'moisturize',
] as const;

export type RoutineBuilderStepKey = (typeof ROUTINE_BUILDER_STEP_KEYS)[number];

export type RoutineBuilderSelections = {
  goal: string;
  cleanse: string;
  treat: string;
  moisturize: string;
};

export type RoutineBuilderState = RoutineBuilderSelections & {
  step?: RoutineBuilderStepKey;
};

export function stepKeyToType(key: RoutineBuilderStepKey): RoutineStepType {
  const map: Record<RoutineBuilderStepKey, RoutineStepType> = {
    cleanse: 'Cleanse',
    treat: 'Treat',
    moisturize: 'Moisturize',
  };
  return map[key];
}

export function stepTypeToKey(step: RoutineStepType): RoutineBuilderStepKey {
  const map: Record<RoutineStepType, RoutineBuilderStepKey> = {
    Cleanse: 'cleanse',
    Treat: 'treat',
    Moisturize: 'moisturize',
  };
  return map[step];
}

export function parseRoutineBuilderSelections(
  searchParams: URLSearchParams,
): RoutineBuilderSelections {
  return {
    goal: searchParams.get('goal')?.trim() ?? '',
    cleanse: searchParams.get('cleanse')?.trim() ?? '',
    treat: searchParams.get('treat')?.trim() ?? '',
    moisturize: searchParams.get('moisturize')?.trim() ?? '',
  };
}

export function parseActiveStep(
  searchParams: URLSearchParams,
): RoutineBuilderStepKey | null {
  const step = searchParams.get('step')?.trim() ?? '';
  return isValidStepKey(step) ? step : null;
}

export function buildRoutineBuilderQuery(
  state: Partial<RoutineBuilderState>,
): string {
  const params = new URLSearchParams();
  if (state.goal) params.set('goal', state.goal);
  if (state.cleanse) params.set('cleanse', state.cleanse);
  if (state.treat) params.set('treat', state.treat);
  if (state.moisturize) params.set('moisturize', state.moisturize);
  if (state.step) params.set('step', state.step);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function routineBuilderPath(
  state: Partial<RoutineBuilderState> = {},
): string {
  return `/routine-builder${buildRoutineBuilderQuery(state)}`;
}

export function isValidStepKey(value: string): value is RoutineBuilderStepKey {
  return ROUTINE_BUILDER_STEP_KEYS.includes(value as RoutineBuilderStepKey);
}

/** Wizard: treat unlocks after cleanse; moisturize after treat. */
export function isStepUnlocked(
  stepKey: RoutineBuilderStepKey,
  selections: RoutineBuilderSelections,
): boolean {
  if (stepKey === 'cleanse') return true;
  if (stepKey === 'treat') return Boolean(selections.cleanse);
  if (stepKey === 'moisturize') return Boolean(selections.treat);
  return false;
}

export function firstIncompleteStep(
  selections: RoutineBuilderSelections,
): RoutineBuilderStepKey {
  for (const key of ROUTINE_BUILDER_STEP_KEYS) {
    if (!selections[key]) return key;
  }
  return 'moisturize';
}

export function resolveActiveStep(
  selections: RoutineBuilderSelections,
  stepParam: RoutineBuilderStepKey | null,
): RoutineBuilderStepKey {
  if (stepParam && isStepUnlocked(stepParam, selections)) {
    return stepParam;
  }
  return firstIncompleteStep(selections);
}
