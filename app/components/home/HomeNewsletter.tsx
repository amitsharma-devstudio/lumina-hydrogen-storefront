export function HomeNewsletter() {
  return (
    <section className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-black px-6 py-16 text-center text-white md:px-12">
          <h2 className="text-4xl font-light tracking-tight md:text-5xl">
            Join Our Community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 md:text-base">
            Subscribe for exclusive offers and skincare tips
          </p>

          <form
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/40"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

