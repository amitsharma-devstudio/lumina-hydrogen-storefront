import {
  data as remixData,
  useLoaderData,
  type ShouldRevalidateFunctionArgs,
} from 'react-router';
import type {Route} from './+types/($locale).account';
import {AccountShell} from '~/components/account/AccountShell';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Account | Lumina'}];
};

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  // Keep parent customer payload stable when hopping across account tabs.
  // Revalidate immediately for non-GET submissions so profile/name changes apply.
  if (formMethod && formMethod !== 'GET') return true;

  const accountPathPattern = /\/account(\/|$)/;
  const stayingInsideAccount =
    accountPathPattern.test(currentUrl.pathname) &&
    accountPathPattern.test(nextUrl.pathname);

  if (stayingInsideAccount) return false;

  return defaultShouldRevalidate;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  await customerAccount.handleAuthStatus();

  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  return <AccountShell customer={customer} />;
}
