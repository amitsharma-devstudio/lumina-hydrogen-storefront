import {Link} from 'react-router';

/**
 * Friendly placeholder shown when a footer/info destination (a Shopify page or
 * policy) hasn't been published yet. Keeps dummy links intuitive: the URL still
 * reflects the topic and the visitor lands on something useful instead of a 404.
 */
export function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
        Coming soon
      </span>

      <h1 className="text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
        {title}
      </h1>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
        {description ??
          `We're putting the finishing touches on this page. Check back shortly — in the meantime, explore our products or reach out and we'll be happy to help.`}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/collections/all"
          prefetch="intent"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-neutral-700"
        >
          Shop all products
        </Link>
        <Link
          to="/"
          prefetch="intent"
          className="rounded-full border border-neutral-300 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

/** Turn a URL handle (e.g. `privacy-policy`) into a readable title (`Privacy Policy`). */
export function titleFromHandle(handle: string) {
  return handle
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
