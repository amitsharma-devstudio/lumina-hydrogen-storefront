import type {ReactNode} from 'react';
import type {
  IngredientDisplay,
  RoutineStepDisplay,
} from '~/lib/skincare';
import {parseAmPmPills} from '~/lib/skincare';

function Pill({
  children,
  variant = 'neutral',
}: {
  children: ReactNode;
  variant?: 'neutral' | 'safe' | 'avoid' | 'accent';
}) {
  const styles = {
    neutral: 'bg-neutral-100 text-neutral-800 ring-neutral-200/80',
    safe: 'bg-emerald-50 text-emerald-900 ring-emerald-200/80',
    avoid: 'bg-amber-50 text-amber-900 ring-amber-200/80',
    accent: 'bg-black text-white ring-black',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function PillRow({
  label,
  items,
  variant = 'neutral',
}: {
  label: string;
  items: string[];
  variant?: 'neutral' | 'safe' | 'avoid';
}) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Pill key={item} variant={variant}>
            {item}
          </Pill>
        ))}
      </div>
    </div>
  );
}

export function RoutinePlacementCard({routine}: {routine: RoutineStepDisplay}) {
  const amPmPills = parseAmPmPills(routine.amPm);
  return (
    <section
      className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5"
      aria-label="Routine placement"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
          {routine.step}
        </span>
        <div>
          <p className="text-sm font-medium text-black">{routine.label}</p>
          {routine.category ? (
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              {routine.category}
            </p>
          ) : null}
        </div>
        {amPmPills.length ? (
          <div className="ml-auto flex flex-wrap gap-2">
            {amPmPills.map((t) => (
              <Pill key={t} variant="accent">
                {t}
              </Pill>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function IngredientBlendCard({
  ingredients,
}: {
  ingredients: IngredientDisplay[];
}) {
  if (!ingredients.length) return null;
  return (
    <section className="mt-6" aria-labelledby="ingredient-blend-heading">
      <h3
        id="ingredient-blend-heading"
        className="text-sm font-medium text-black"
      >
        Key active ingredients
      </h3>
      <ul className="mt-4 space-y-3">
        {ingredients.map((ing) => (
          <li
            key={ing.id}
            className="rounded-xl border border-neutral-100 bg-white px-4 py-3 text-sm"
          >
            <span className="font-medium text-black">{ing.label}</span>
            {ing.inci ? (
              <span className="text-neutral-500"> ({ing.inci})</span>
            ) : null}
            {ing.target ? (
              <p className="mt-1 text-neutral-600">{ing.target}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CompatibilityCard({
  skinTypes,
  safeWith,
  avoidWith,
}: {
  skinTypes: string[];
  safeWith: string[];
  avoidWith: string[];
}) {
  const hasContent =
    skinTypes.length || safeWith.length || avoidWith.length;
  if (!hasContent) return null;

  return (
    <section
      className="mt-6 space-y-4 rounded-2xl bg-neutral-50 p-5"
      aria-label="Skin compatibility"
    >
      <h3 className="text-sm font-medium text-black">Compatibility</h3>
      <PillRow label="Designed for" items={skinTypes} variant="neutral" />
      <PillRow label="Pairs well with" items={safeWith} variant="safe" />
      <PillRow label="Avoid pairing with" items={avoidWith} variant="avoid" />
    </section>
  );
}
