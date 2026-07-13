import {Suspense, useEffect, useId, useRef, useState} from 'react';
import {Await, Form} from 'react-router';
import {Link} from '~/components/Link';
import {useLocalizedPath} from '~/lib/i18n';
import {focusRingClass} from '~/lib/theme';

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

/**
 * Header profile control — menu with account links + sign in / sign out.
 */
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
        {(loggedIn) => <AccountMenu loggedIn={loggedIn} />}
      </Await>
    </Suspense>
  );
}

function AccountMenu({loggedIn}: {loggedIn: boolean}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const triggerId = useId();
  const logoutPath = useLocalizedPath('/account/logout');

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const itemClass =
    'flex w-full items-center px-3.5 py-2.5 text-left text-sm text-neutral-800 no-underline transition-colors hover:bg-neutral-50 hover:text-neutral-900';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={triggerId}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-700 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-black ${focusRingClass}`}
        aria-label={loggedIn ? 'Account menu' : 'Account'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <AccountIcon />
      </button>

      {open ? (
        <div
          id={listId}
          role="menu"
          aria-labelledby={triggerId}
          className="absolute right-0 z-50 mt-2 min-w-[14rem] overflow-hidden rounded-xl border border-neutral-200/90 bg-white py-1 shadow-[0_16px_40px_rgba(24,21,18,0.14)]"
        >
          {loggedIn ? (
            <>
              <Link
                variant="nav"
                role="menuitem"
                to="/account"
                prefetch="intent"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                Overview
              </Link>
              <Link
                variant="nav"
                role="menuitem"
                to="/account/orders"
                prefetch="intent"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                Orders
              </Link>
              <Link
                variant="nav"
                role="menuitem"
                to="/account/profile"
                prefetch="intent"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <Link
                variant="nav"
                role="menuitem"
                to="/account/addresses"
                prefetch="intent"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                Addresses
              </Link>
              <div className="my-1 border-t border-neutral-100" />
              <Form method="POST" action={logoutPath}>
                <button
                  type="submit"
                  role="menuitem"
                  className={`${itemClass} text-neutral-600`}
                >
                  Sign out
                </button>
              </Form>
            </>
          ) : (
            <Link
              variant="nav"
              role="menuitem"
              to="/account/login"
              prefetch="intent"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}
