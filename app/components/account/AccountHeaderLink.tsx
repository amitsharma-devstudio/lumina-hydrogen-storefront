import {Suspense} from 'react';
import {Link} from '~/components/Link';
import {Await} from 'react-router';

function AccountIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function AccountHeaderLink({
  isLoggedIn,
}: {
  isLoggedIn: Promise<boolean>;
}) {
  return (
    <Suspense
      fallback={
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-500"
          aria-hidden
        >
          <AccountIcon />
        </span>
      }
    >
      <Await resolve={isLoggedIn}>
        {(loggedIn) => (
          <Link variant="nav"
            to={loggedIn ? '/account' : '/account/login'}
            prefetch="intent"
            aria-label={loggedIn ? 'My account' : 'Sign in'}
            title={loggedIn ? 'My account' : 'Sign in'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-700 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-black"
          >
            <AccountIcon />
          </Link>
        )}
      </Await>
    </Suspense>
  );
}
