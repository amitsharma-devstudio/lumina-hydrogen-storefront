import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/($locale).account.orders._index';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {
  AccountEmptyState,
  AccountSection,
} from '~/components/account/AccountShell';
import {Button} from '~/components/ui/Button';
import {inputFieldClass} from '~/lib/theme';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders | Lumina'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  await customerAccount.handleAuthStatus();
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="space-y-6">
      <AccountSection
        title="Order history"
        description="View past purchases, track fulfillment, and open order details."
      >
        <OrderSearchForm currentFilters={filters} />
        <OrdersTable orders={orders} filters={filters} />
      </AccountSection>
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div aria-live="polite">
      {orders?.nodes.length ? (
        <div className="space-y-4">
          <PaginatedResourceSection connection={orders}>
            {({node: order}) => <OrderItem key={order.id} order={order} />}
          </PaginatedResourceSection>
        </div>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  if (hasFilters) {
    return (
      <AccountEmptyState
        message="No orders match your search."
        action={{label: 'Clear filters', to: '/account/orders'}}
      />
    );
  }

  return (
    <AccountEmptyState
      message="You haven't placed any orders yet."
      action={{label: 'Start shopping', to: '/collections/all'}}
    />
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4"
      aria-label="Search orders"
    >
      <fieldset className="space-y-4">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Filter orders
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Order #"
            aria-label="Order number"
            defaultValue={currentFilters.name || ''}
            className={inputFieldClass}
          />
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirmation #"
            aria-label="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className={inputFieldClass}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSearching} className="!h-10 !min-h-10 px-5 text-xs">
            {isSearching ? 'Searching…' : 'Search'}
          </Button>
          {hasFilters ? (
            <Button
              type="button"
              variant="secondary"
              disabled={isSearching}
              className="!h-10 !min-h-10 px-5 text-xs"
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </fieldset>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  const orderUrl = `/account/orders/${btoa(order.id)}`;

  return (
    <article className="rounded-xl border border-neutral-200/90 bg-white p-4 transition hover:border-brand-100 hover:shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            to={orderUrl}
            prefetch="intent"
            className="text-base font-medium text-neutral-900 hover:text-primary"
          >
            Order #{order.number}
          </Link>
          <p className="mt-1 text-sm text-neutral-500">
            {new Date(order.processedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Money
          data={order.totalPrice}
          className="text-base font-medium tabular-nums text-neutral-900"
        />
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {order.confirmationNumber ? (
          <div>
            <dt className="text-neutral-500">Confirmation</dt>
            <dd className="font-medium text-neutral-800">
              {order.confirmationNumber}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-neutral-500">Payment</dt>
          <dd className="font-medium capitalize text-neutral-800">
            {order.financialStatus?.toLowerCase().replace(/_/g, ' ')}
          </dd>
        </div>
        {fulfillmentStatus ? (
          <div>
            <dt className="text-neutral-500">Fulfillment</dt>
            <dd className="font-medium capitalize text-neutral-800">
              {fulfillmentStatus.toLowerCase().replace(/_/g, ' ')}
            </dd>
          </div>
        ) : null}
      </dl>

      <Link
        to={orderUrl}
        prefetch="intent"
        className="mt-4 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        View order details →
      </Link>
    </article>
  );
}
