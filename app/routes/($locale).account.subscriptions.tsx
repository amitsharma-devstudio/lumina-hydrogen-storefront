import {
  data,
  useActionData,
  useFetcher,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/($locale).account.subscriptions';
import {SUBSCRIPTIONS_CONTRACTS_QUERY} from '~/graphql/customer-account/CustomerSubscriptionsQuery';
import {SUBSCRIPTION_CANCEL_MUTATION} from '~/graphql/customer-account/CustomerSubscriptionsMutations';
import {
  AccountEmptyState,
  AccountSection,
} from '~/components/account/AccountShell';
import {Button} from '~/components/ui/Button';

export type ActionResponse = {
  error: string | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Subscriptions | Lumina'}];
};

export async function loader({context}: Route.LoaderArgs) {
  await context.customerAccount.handleAuthStatus();

  const {data: subscriptions, errors} = await context.customerAccount.query(
    SUBSCRIPTIONS_CONTRACTS_QUERY,
  );

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(', '));
  }

  return {subscriptions};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'DELETE') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const subId = form.get('subId');

    if (!subId || typeof subId !== 'string') {
      throw new Error('Subscription ID is required');
    }

    const {data: result, errors} = await customerAccount.mutate(
      SUBSCRIPTION_CANCEL_MUTATION,
      {
        variables: {
          subscriptionContractId: subId,
        },
      },
    );

    const userErrors =
      result?.subscriptionContractCancel?.userErrors ?? [];
    if (errors?.length || userErrors.length) {
      throw new Error(
        [
          ...(errors?.map((error) => error.message) ?? []),
          ...userErrors.map((error) => error.message),
        ].join(', ') || 'Unable to cancel subscription',
      );
    }

    return {error: null};
  } catch (error) {
    return data(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 400},
    );
  }
}

type SubscriptionContract = NonNullable<
  NonNullable<
    Awaited<ReturnType<typeof loader>>['subscriptions']
  >['customer']
>['subscriptionContracts']['nodes'][number];

export default function AccountSubscriptions() {
  const action = useActionData<ActionResponse>();
  const {subscriptions} = useLoaderData<typeof loader>();
  const contracts = subscriptions?.customer?.subscriptionContracts?.nodes ?? [];
  const fetcher = useFetcher();

  return (
    <AccountSection
      title="Subscriptions"
      description="Manage recurring deliveries. Cancel anytime — changes apply from the next billing cycle."
    >
      {action?.error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {action.error}
        </p>
      ) : null}

      {contracts.length ? (
        <ul className="space-y-4" aria-label="Subscriptions">
          {contracts.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              fetcher={fetcher}
            />
          ))}
        </ul>
      ) : (
        <AccountEmptyState
          message="You don't have any subscriptions yet."
          action={{label: 'Browse products', to: '/collections/all'}}
        />
      )}
    </AccountSection>
  );
}

function SubscriptionRow({
  subscription,
  fetcher,
}: {
  subscription: SubscriptionContract;
  fetcher: ReturnType<typeof useFetcher>;
}) {
  const isBeingCancelled =
    fetcher.state !== 'idle' &&
    fetcher.formData?.get('subId') === subscription.id;
  const isActive = subscription.status === 'ACTIVE';

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-neutral-200/90 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0 space-y-1.5 text-sm text-neutral-700">
        <div className="space-y-0.5">
          {subscription.lines.nodes.map((line) => (
            <p key={line.id} className="font-medium text-neutral-900">
              {line.name}
            </p>
          ))}
        </div>
        <p className="text-neutral-500">
          Every{' '}
          <SubscriptionInterval billingPolicy={subscription.billingPolicy} />
        </p>
        {subscription.discounts?.nodes?.length ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {subscription.discounts.nodes.map((discount) => (
              <span
                key={discount.id}
                className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-600"
              >
                {formatDiscountValue(discount)}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`text-[10px] font-medium uppercase tracking-[0.14em] ${
            isActive ? 'text-primary' : 'text-neutral-400'
          }`}
        >
          {subscription.status}
        </span>
        {isActive ? (
          <fetcher.Form method="DELETE">
            <input type="hidden" name="subId" value={subscription.id} />
            <Button
              type="submit"
              variant="secondary"
              disabled={isBeingCancelled}
              className="!h-9 !min-h-9 px-4 text-[11px] uppercase tracking-[0.12em]"
            >
              {isBeingCancelled ? 'Canceling…' : 'Cancel'}
            </Button>
          </fetcher.Form>
        ) : null}
      </div>
    </li>
  );
}

function SubscriptionInterval({
  billingPolicy,
}: {
  billingPolicy: SubscriptionContract['billingPolicy'];
}) {
  const count = billingPolicy.intervalCount?.count ?? 1;
  const suffix = count === 1 ? '' : 's';
  const unit = (() => {
    switch (billingPolicy.interval) {
      case 'DAY':
        return `day${suffix}`;
      case 'WEEK':
        return `week${suffix}`;
      case 'MONTH':
        return `month${suffix}`;
      case 'YEAR':
        return `year${suffix}`;
      default:
        return 'period';
    }
  })();

  return (
    <span>
      {count} {unit}
    </span>
  );
}

function formatDiscountValue(
  discount: NonNullable<
    SubscriptionContract['discounts']
  >['nodes'][number],
): string {
  const value = discount.value;

  if (value?.__typename === 'SubscriptionDiscountPercentageValue') {
    return `${value.percentage}% off`;
  }
  if (value?.__typename === 'SubscriptionDiscountFixedAmountValue') {
    return `$${value.amount.amount} off`;
  }
  if (discount.title) return discount.title;
  return 'Discount applied';
}
