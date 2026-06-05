import {
  HOME_BTN_PRIMARY,
  HOME_SECTION_EYEBROW,
  HOME_SECTION_MUTED,
  HOME_SECTION_TITLE,
} from '~/components/home/homeSectionStyles';

export function HomeNewsletter() {
  return (
    <section className={HOME_SECTION_MUTED} aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-[0_1px_0_rgba(28,25,23,0.04)] md:grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-brand-100 p-8 md:border-b-0 md:border-r md:p-10 lg:p-12">
            <p className={HOME_SECTION_EYEBROW}>The skin journal</p>
            <h2
              id="newsletter-heading"
              className={`${HOME_SECTION_TITLE} mt-4`}
            >
              Get the routine edit before everyone else
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
              Monthly notes on barrier care, actives, and launches — written for
              real routines, not algorithm noise.
            </p>
          </div>

          <form
            className="flex flex-col justify-center gap-5 bg-brand-50/40 p-8 md:p-10 lg:p-12"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="text-sm leading-relaxed text-neutral-600">
              Join for ingredient explainers, early access, and private offers.
              Unsubscribe anytime.
            </p>
            <div className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm text-foreground placeholder:text-neutral-400 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button type="submit" className={HOME_BTN_PRIMARY}>
                Join the list
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
