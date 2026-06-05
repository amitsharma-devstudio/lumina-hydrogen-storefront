import {Link} from 'react-router';
import {
  HOME_BTN_PRIMARY,
  HOME_SECTION_HEADER,
  HOME_SECTION_EYEBROW,
  HOME_SECTION_LEDE,
  HOME_SECTION_MUTED,
  HOME_SECTION_TITLE,
} from '~/components/home/homeSectionStyles';

const STEPS = [
  {
    index: '01',
    label: 'Select your concern',
    description: 'Glow, Barrier, Clarity, or Renewal',
  },
  {
    index: '02',
    label: 'Choose your three steps',
    description: 'Cleanse, treat, and moisturize from our edit',
  },
  {
    index: '03',
    label: 'Shop your routine',
    description: 'Add your picks and checkout in one flow',
  },
] as const;

export function HomeRoutineTeaser() {
  return (
    <section
      className={HOME_SECTION_MUTED}
      aria-labelledby="routine-builder-teaser"
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className={HOME_SECTION_HEADER}>
          <div>
            <p className={HOME_SECTION_EYEBROW}>Routine builder</p>
            <h2 id="routine-builder-teaser" className={HOME_SECTION_TITLE}>
              Build a three-step routine for your skin goal
            </h2>
          </div>
          <p className={HOME_SECTION_LEDE}>
            Choose a concern, then pick one product per step from collections
            curated in Shopify Admin — no guesswork from a crowded shelf.
          </p>
        </header>

        <ol className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.index}
              className="rounded-2xl border border-neutral-200 bg-white p-5"
            >
              <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                Step {step.index}
              </span>
              <p className="mt-4 text-lg font-light text-neutral-950">
                {step.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <Link to="/routine-builder" prefetch="intent" className={HOME_BTN_PRIMARY}>
          Start your routine
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
