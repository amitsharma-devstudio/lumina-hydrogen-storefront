import {Link} from 'react-router';

const SHOP_BY_LINKS = [
  {
    label: 'Cleanse',
    eyebrow: 'Step 01',
    description: 'Soft resets that leave the barrier comfortable.',
    to: '/collections/cleanser',
  },
  {
    label: 'Treat',
    eyebrow: 'Step 02',
    description: 'Serums and actives for tone, texture, and glow.',
    to: '/collections/serums',
  },
  {
    label: 'Moisturize',
    eyebrow: 'Step 03',
    description: 'Cushioning hydration for day, night, and recovery.',
    to: '/collections/moisturizers',
  },
  {
    label: 'Bestsellers',
    eyebrow: 'Most loved',
    description: 'The formulas customers reorder first.',
    to: '/collections/bestseller',
  },
] as const;

export function HomeShopBy() {
  return (
    <section className="border-b border-brand-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.15em] text-primary">
              Shop the ritual
            </p>
            <h2 className="text-3xl font-light text-neutral-950 md:text-4xl">
              Choose your next step
            </h2>
          </div>
          <Link
            to="/collections/all"
            prefetch="intent"
            className="inline-flex w-fit rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:border-primary hover:text-primary"
          >
            Shop all products
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SHOP_BY_LINKS.map(({label, eyebrow, description, to}) => (
            <li key={to}>
              <Link
                to={to}
                prefetch="intent"
                className="group flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-[#fbfaf8] p-5 transition-colors hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  {eyebrow}
                </span>
                <span className="mt-8 text-xl font-light text-neutral-950">
                  {label}
                </span>
                <span className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {description}
                </span>
                <span className="mt-6 text-sm font-medium text-primary">
                  Explore →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
