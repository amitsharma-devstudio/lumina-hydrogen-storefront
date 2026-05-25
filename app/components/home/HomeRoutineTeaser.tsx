import {Link} from 'react-router';

export function HomeRoutineTeaser() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-950 py-16 text-white md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.15em] text-brand-200">
            Routine builder
          </p>
          <h2 className="text-3xl font-light md:text-4xl">
            Build a three-step routine for your skin goal
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
            Choose Glow, Barrier, Clarity, or Renewal — then pick one product per
            step from our edit.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <ol className="grid w-full max-w-sm gap-2 text-sm text-white/80 md:text-right">
            <li>1. Select your concern</li>
            <li>2. Choose cleanse, treat &amp; moisturize</li>
            <li>3. Shop your routine</li>
          </ol>
          <Link
            to="/routine-builder"
            prefetch="intent"
            className="inline-flex w-full justify-center rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover md:w-auto"
          >
            Start your routine
          </Link>
        </div>
      </div>
    </section>
  );
}
