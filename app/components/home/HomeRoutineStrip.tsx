import {Link} from 'react-router';

const ROUTINE_STEPS = [
  {
    step: '01',
    title: 'Cleanse',
    description: 'Gentle formulas that respect your skin barrier.',
    to: '/collections/cleanser',
  },
  {
    step: '02',
    title: 'Treat',
    description: 'Targeted serums for brightening and renewal.',
    to: '/collections/serums',
  },
  {
    step: '03',
    title: 'Moisturize',
    description: 'Lock in hydration for all-day comfort.',
    to: '/collections/moisturizers',
  },
] as const;

export function HomeRoutineStrip() {
  return (
    <section className="bg-neutral-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-brand-200">
            Your routine
          </p>
          <h2 className="text-4xl font-light text-white md:text-5xl">
            A premium routine should feel effortless, not overbuilt
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
            Lumina edits skincare into three repeatable steps, so the homepage
            teaches the customer how to buy before asking them to decide.
          </p>
        </header>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {ROUTINE_STEPS.map((item) => (
            <li key={item.step}>
              <Link
                to={item.to}
                prefetch="intent"
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-8 transition-colors hover:border-brand-200/50 hover:bg-white/[0.07]"
              >
                <span className="text-4xl font-light tabular-nums text-brand-200/60 transition-colors group-hover:text-brand-200">
                  {item.step}
                </span>
                <h3 className="mt-4 text-2xl font-light text-white">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
                  {item.description}
                </p>
                <span className="mt-6 text-sm font-medium text-brand-200">
                  Shop {item.title.toLowerCase()} →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
