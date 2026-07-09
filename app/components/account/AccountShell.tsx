import {Form, NavLink, Outlet} from 'react-router';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {Breadcrumbs} from '~/components/ui/Breadcrumbs';
import {btnLinkClass, btnSecondaryClass} from '~/lib/theme';

const ACCOUNT_NAV = [
  {to: '/account/orders', label: 'Orders'},
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
    <main className="account-page bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
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
              <NavLink
                key={to}
                to={to}
                prefetch="intent"
                className={({isActive}) =>
                  [
                    'rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition',
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
            <Form
              method="POST"
              action="/account/logout"
              className="account-logout ml-auto"
            >
              <button
                type="submit"
                className={`${btnSecondaryClass} !h-9 !min-h-9 px-4 text-[11px] uppercase tracking-[0.14em]`}
              >
                Sign out
              </button>
            </Form>
          </nav>
        </header>

        <div className="mt-8">
          <Outlet context={{customer}} />
        </div>
      </div>
    </main>
  );
}

export function AccountSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:p-6">
      <header className="mb-5 border-b border-neutral-100 pb-4">
        <h2 className="text-lg font-medium text-neutral-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
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
        <NavLink
          to={action.to}
          prefetch="intent"
          className={`${btnLinkClass} mt-4 inline-block text-sm font-medium`}
        >
          {action.label} →
        </NavLink>
      ) : null}
    </div>
  );
}
