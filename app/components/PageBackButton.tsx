import {useNavigate, useLocation} from 'react-router';
import {cleanPath} from '~/lib/i18n';

type HistoryIndexState = {
  idx?: number;
};

/**
 * Sitewide back control for every non-home page.
 * Uses in-app history when available; otherwise falls back to home.
 */
export function PageBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = cleanPath(location.pathname) === '/';
  const historyIdx = (location.state as HistoryIndexState | null)?.idx ?? 0;

  if (isHome) return null;

  return (
    <div className="border-b border-[var(--color-home-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-2.5 sm:px-6">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          onClick={() => {
            if (historyIdx > 0) {
              navigate(-1);
              return;
            }
            navigate('/');
          }}
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
