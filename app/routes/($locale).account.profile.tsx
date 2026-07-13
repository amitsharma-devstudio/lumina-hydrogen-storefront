import {useEffect, useState} from 'react';
import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/($locale).account.profile';
import {
  AccountSection,
  EditIconButton,
} from '~/components/account/AccountShell';
import {Button} from '~/components/ui/Button';
import {inputFieldClass} from '~/lib/theme';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Profile | Lumina'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;
  const hasName = Boolean(customer.firstName?.trim() || customer.lastName?.trim());
  const [editing, setEditing] = useState(!hasName);

  useEffect(() => {
    if (action?.customer && !action.error) {
      setEditing(false);
    }
  }, [action]);

  return (
    <AccountSection
      title="Profile"
      description={
        editing
          ? 'Update the name associated with your Lumina account.'
          : 'Your name on file for orders and checkout.'
      }
      action={
        !editing && hasName ? (
          <EditIconButton label="Edit profile" onClick={() => setEditing(true)} />
        ) : null
      }
    >
      {!editing && hasName ? (
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              First name
            </dt>
            <dd className="mt-1 text-base text-neutral-900">
              {customer.firstName || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              Last name
            </dt>
            <dd className="mt-1 text-base text-neutral-900">
              {customer.lastName || '—'}
            </dd>
          </div>
        </dl>
      ) : (
        <Form method="PUT" className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm text-neutral-600"
              >
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                aria-label="First name"
                defaultValue={customer.firstName ?? ''}
                minLength={2}
                className={inputFieldClass}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm text-neutral-600"
              >
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                aria-label="Last name"
                defaultValue={customer.lastName ?? ''}
                minLength={2}
                className={inputFieldClass}
              />
            </div>
          </div>

          {action?.error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {action.error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={state !== 'idle'}
              className="!h-10 !min-h-10 px-6 text-xs"
            >
              {state !== 'idle' ? 'Saving…' : 'Save'}
            </Button>
            {hasName ? (
              <Button
                type="button"
                variant="secondary"
                className="!h-10 !min-h-10 px-6 text-xs"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </Form>
      )}
    </AccountSection>
  );
}
