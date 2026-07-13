import {Outlet} from 'react-router';
import {Link} from '~/components/Link';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {Breadcrumbs} from '~/components/ui/Breadcrumbs';
import {btnLinkClass} from '~/lib/theme';

const ACCOUNT_NAV = [
  {to: '/account/orders', label: 'Orders'},
  {to: '/account/subscriptions', label: 'Subscriptions'},
  {to: '/account/wishlist', label: 'Wishlist'},
  {to: '/account/profile', label: 'Profile'},
  {to: '/account/addresses', label: 'Addresses'},
] as const;

export function AccountShell({
  customer,
}: {
  customer: CustomerFragment;
}) {
  const heading = customer.firstName
    ? `Welcome, ${customer.firstName}`
    : 'Your account';

  return (
    <div className="account-page bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
        <Breadcrumbs
          items={[
            {label: 'Home', to: '/'},
            {label: 'Account'},
          ]}
        />

        <header className="mt-6 border-b border-neutral-100 pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
            Account
          </p>
          <h1 className="mt-1 text-3xl font-light tracking-tight text-neutral-900 lg:text-4xl">
            {heading}
          </h1>
          {/* Email confirms which Shopify identity is signed in */}
          {customer.emailAddress?.emailAddress ? (
            <p className="mt-2 text-sm text-neutral-500">
              {customer.emailAddress.emailAddress}
            </p>
          ) : null}

          <nav
            className="mt-6 flex flex-wrap items-center gap-2"
            aria-label="Account sections"
          >
            {ACCOUNT_NAV.map(({to, label}) => (
              <Link
                variant="nav"
                key={to}
                to={to}
                prefetch="intent"
                className={({isActive}) =>
                  [
                    'account-nav-pill rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] no-underline transition',
                    isActive
                      ? 'account-nav-pill--active bg-primary !text-primary-foreground'
                      : 'border border-neutral-200 !text-neutral-600 hover:border-neutral-300 hover:!text-neutral-900',
                  ].join(' ')
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="mt-8">
          <Outlet context={{customer}} />
        </div>
      </div>
    </div>
  );
}

export function AccountSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  /** Optional control in the section header (e.g. edit icon). */
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="account-section rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div style={{padding: '2rem'}}>
        <header className="mb-5 flex items-start justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="min-w-0">
            <h2 className="text-lg font-medium text-neutral-900">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-neutral-500">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
        {children}
      </div>
    </div>
  );
}

export function AccountEmptyState({
  message,
  action,
}: {
  message: string;
  action?: {label: string; to: string};
}) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 px-6 py-10 text-center">
      <p className="text-sm text-neutral-600">{message}</p>
      {action ? (
        <Link
          variant="nav"
          to={action.to}
          prefetch="intent"
          className={`${btnLinkClass} mt-4 inline-block text-sm font-medium`}
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  );
}

export function EditIconButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 3.487 3.65 3.65M4.5 19.5v-3.65L15.94 4.41a1.5 1.5 0 0 1 2.122 0l1.528 1.528a1.5 1.5 0 0 1 0 2.122L8.15 19.5H4.5Z"
        />
      </svg>
    </button>
  );
}
