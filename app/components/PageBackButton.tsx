import {useNavigate, useLocation} from 'react-router';
import {cleanPath} from '~/lib/i18n';

/**
 * Sitewide back control for every non-home page.
 * Matches the browser back button: always go to the previous history entry.
 */
export function PageBackButton() {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const isHome = cleanPath(pathname) === '/';

  if (isHome) return null;

  return (
    <div className="border-b border-[var(--color-home-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-2.5 sm:px-6">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <span aria-hidden className="text-base leading-none">
            ←
          </span>
          Back
        </button>
      </div>
    </div>
  );
}
