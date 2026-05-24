export function HomeNewsletter() {
  return (
    <section className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid overflow-hidden rounded-[2rem] bg-neutral-950 text-white md:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-white/10 p-8 md:border-b-0 md:border-r md:p-12">
            <p className="text-xs uppercase tracking-[0.15em] text-brand-200">
              The skin journal
            </p>
            <h2 className="mt-4 text-4xl font-light md:text-5xl">
              Get the routine edit before everyone else
            </h2>
          </div>

          <form
            className="flex flex-col justify-center gap-4 p-8 md:p-12"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
              Monthly skin notes, ingredient explainers, launch previews, and
              private offers. No inbox clutter.
            </p>
            <div className="flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-8 py-4 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-90"
              >
                Join the list
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
