import {Link} from 'react-router';

export function HomeHero() {
  return (
    <section className="bg-white pt-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <span className="w-fit rounded-full bg-neutral-50 px-4 py-2 text-xs tracking-[0.08em] text-neutral-900">
            NEW ARRIVALS
          </span>

          <h1 className="text-5xl font-light leading-[1.05] tracking-[-0.02em] text-black md:text-7xl">
            Radiant <br />
            Skin <br />
            Simplified
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-neutral-500 md:text-xl">
            Science-backed formulations that deliver visible results. Experience
            the luxury of effective skincare.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/products/all"
              prefetch="intent"
              className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-sm text-white transition-opacity hover:opacity-80"
            >
              Shop Now
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/pages/about"
              prefetch="intent"
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-8 py-4 text-sm text-black transition-colors hover:border-black"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200"
            alt="Skincare"
            className="aspect-[4/5] w-full rounded-2xl object-cover"
            loading="eager"
          />

          <div className="absolute bottom-4 left-4 rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.10)] md:-bottom-6 md:-left-6">
            <div className="text-xs text-neutral-500">Starting from</div>
            <div className="text-3xl font-light text-black">$45</div>
          </div>
        </div>
      </div>
    </section>
  );
}

