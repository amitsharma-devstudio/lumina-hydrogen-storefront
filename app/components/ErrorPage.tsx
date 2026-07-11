import {Link} from 'react-router';
import {SkipToContent} from '~/components/SkipToContent';
import {btnPrimaryLinkClass, btnSecondaryClass} from '~/lib/theme';

type ErrorPageProps = {
  status?: number;
  title?: string;
  message?: string;
  /** Show technical detail (dev / unexpected errors). */
  detail?: string | null;
};

function defaultCopy(status: number) {
  if (status === 404) {
    return {
      eyebrow: '404',
      title: 'Page not found',
      message:
        'That page may have moved, or the link is out of date. Explore the catalog or head home to continue your routine.',
    };
  }

  if (status === 503) {
    return {
      eyebrow: 'Unavailable',
      title: 'We’re refreshing the storefront',
      message:
        'Something is temporarily offline. Please try again in a moment.',
    };
  }

  return {
    eyebrow: String(status || 'Error'),
    title: 'Something went wrong',
    message:
      'We hit an unexpected issue. You can go home or browse products while we sort it out.',
  };
}

/**
 * Branded full-page error / 404. Self-contained so it works when the root
 * ErrorBoundary replaces App (no Header/Footer).
 */
export function ErrorPage({
  status = 500,
  title,
  message,
  detail,
}: ErrorPageProps) {
  const copy = defaultCopy(status);
  const heading = title ?? copy.title;
  const body = message ?? copy.message;
  const isNotFound = status === 404;

  return (
    <>
      <SkipToContent />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-[100dvh] flex-col bg-white"
      >
        <header className="border-b border-[var(--color-home-border)] bg-white/92">
          <div className="mx-auto flex h-[76px] max-w-7xl items-center px-6">
            <Link
              to="/"
              prefetch="intent"
              className="group inline-flex flex-col leading-none text-black no-underline"
            >
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em]">
                Lumina
              </span>
              <span className="mt-1 h-px w-full origin-left scale-x-75 bg-primary transition-transform group-hover:scale-x-100" />
            </Link>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
            {heading}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
            {body}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/collections/all"
              prefetch="intent"
              className={`${btnPrimaryLinkClass} rounded-full px-7 py-3 text-sm font-medium`}
            >
              Shop all products
            </Link>
            <Link
              to={isNotFound ? '/' : '/collections'}
              prefetch="intent"
              className={`${btnSecondaryClass} !h-auto min-h-12 rounded-full px-7 py-3 text-sm font-medium`}
            >
              {isNotFound ? 'Back to home' : 'Browse collections'}
            </Link>
          </div>

          {detail && import.meta.env.DEV ? (
            <details className="mt-12 w-full max-w-lg rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left">
              <summary className="cursor-pointer text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                Technical details
              </summary>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-neutral-700">
                {detail}
              </pre>
            </details>
          ) : null}
        </div>
      </main>
    </>
  );
}
