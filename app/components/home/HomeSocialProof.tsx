import {
  HOME_SECTION_HEADER,
  HOME_SECTION_EYEBROW,
  HOME_SECTION_LEDE,
  HOME_SECTION_SURFACE,
  HOME_SECTION_TITLE,
} from '~/components/home/homeSectionStyles';

const STATS = [
  {value: '92%', label: 'reported softer-feeling skin'},
  {value: '4.9', label: 'average product rating'},
  {value: '30', label: 'days to love your routine'},
] as const;

const TESTIMONIALS = [
  {
    quote:
      'My skin looks brighter within two weeks—the texture of the vitamin C serum is unreal.',
    author: 'Priya M.',
    detail: 'Verified buyer',
  },
  {
    quote:
      'Finally a routine that feels luxurious but doesn’t irritate sensitive skin.',
    author: 'Jordan L.',
    detail: 'Verified buyer',
  },
] as const;

const STAR_KEYS = ['one', 'two', 'three', 'four', 'five'] as const;

export function HomeSocialProof() {
  return (
    <section className={HOME_SECTION_SURFACE}>
      <div className="mx-auto max-w-7xl px-6">
        <header className={HOME_SECTION_HEADER}>
          <div>
            <p className={HOME_SECTION_EYEBROW}>Proof, not noise</p>
            <h2 className={HOME_SECTION_TITLE}>
              Results customers can see and feel
            </h2>
          </div>
          <p className={HOME_SECTION_LEDE}>
            Premium does not mean mysterious. Put clear outcomes, verified
            voices, and a generous routine promise in view before checkout.
          </p>
        </header>

        <ul className="mb-14 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-brand-100 bg-white sm:grid-cols-3">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="border-b border-brand-100 p-8 sm:border-b-0 sm:border-r last:border-b-0 last:sm:border-r-0"
            >
              <p className="text-4xl font-light text-primary md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-neutral-500">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.author}
              className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            >
              <div className="mb-4 flex gap-0.5 text-primary" aria-hidden>
                {STAR_KEYS.map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>
              <p className="text-lg font-light leading-relaxed text-neutral-800">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 text-sm text-neutral-500">
                <cite className="not-italic font-medium text-neutral-900">
                  {item.author}
                </cite>
                <span className="mx-2 text-neutral-300">·</span>
                {item.detail}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
