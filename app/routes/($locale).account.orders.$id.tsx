import {redirect, useLoaderData} from 'react-router';
import {Link} from '~/components/Link';
import type {Route} from './+types/($locale).account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {AccountSection} from '~/components/account/AccountShell';
import {Breadcrumbs} from '~/components/ui/Breadcrumbs';
import {btnPrimaryLinkClass} from '~/lib/theme';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Order ${data?.order?.name ?? ''} | Lumina`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  await customerAccount.handleAuthStatus();

  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;
  const lineItems = order.lineItems.nodes;
  const discountApplications = order.discountApplications.nodes;
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';
  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          {label: 'Home', to: '/'},
          {label: 'Account', to: '/account'},
          {label: 'Orders', to: '/account/orders'},
          {label: order.name},
        ]}
      />

      <AccountSection
        title={`Order ${order.name}`}
        description={`Placed on ${new Date(order.processedAt!).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`}
      >
        {order.confirmationNumber ? (
          <p className="mb-4 text-sm text-neutral-600">
            Confirmation <span className="font-medium">{order.confirmationNumber}</span>
          </p>
        ) : null}

        <div className="overflow-x-auto rounded-xl border border-neutral-100">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Qty
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {lineItems.map((lineItem) => (
                <OrderLineRow key={lineItem.id} lineItem={lineItem} />
              ))}
            </tbody>
            <tfoot className="border-t border-neutral-100 bg-neutral-50/40 text-sm">
              {((discountValue && discountValue.amount) || discountPercentage) && (
                <tr>
                  <th scope="row" colSpan={3} className="px-4 py-3 text-neutral-600">
                    Discounts
                  </th>
                  <td className="px-4 py-3 tabular-nums text-neutral-900">
                    {discountPercentage ? (
                      <span>-{discountPercentage}%</span>
                    ) : (
                      discountValue && <Money data={discountValue} />
                    )}
                  </td>
                </tr>
              )}
              <tr>
                <th scope="row" colSpan={3} className="px-4 py-3 text-neutral-600">
                  Subtotal
                </th>
                <td className="px-4 py-3 tabular-nums text-neutral-900">
                  <Money data={order.subtotal!} />
                </td>
              </tr>
              <tr>
                <th scope="row" colSpan={3} className="px-4 py-3 text-neutral-600">
                  Tax
                </th>
                <td className="px-4 py-3 tabular-nums text-neutral-900">
                  <Money data={order.totalTax!} />
                </td>
              </tr>
              <tr>
                <th scope="row" colSpan={3} className="px-4 py-3 font-medium text-neutral-900">
                  Total
                </th>
                <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">
                  <Money data={order.totalPrice!} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
            <h3 className="text-sm font-medium text-neutral-900">Shipping address</h3>
            {order?.shippingAddress ? (
              <address className="mt-2 not-italic text-sm leading-relaxed text-neutral-600">
                <p className="font-medium text-neutral-800">
                  {order.shippingAddress.name}
                </p>
                {order.shippingAddress.formatted ? (
                  <p>{order.shippingAddress.formatted}</p>
                ) : null}
                {order.shippingAddress.formattedArea ? (
                  <p>{order.shippingAddress.formattedArea}</p>
                ) : null}
              </address>
            ) : (
              <p className="mt-2 text-sm text-neutral-500">No shipping address</p>
            )}
          </div>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
            <h3 className="text-sm font-medium text-neutral-900">Fulfillment status</h3>
            <p className="mt-2 text-sm capitalize text-neutral-600">
              {fulfillmentStatus.toLowerCase().replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {order.statusPageUrl ? (
          <a
            href={order.statusPageUrl}
            target="_blank"
            rel="noreferrer"
            className={`${btnPrimaryLinkClass} mt-6 inline-flex rounded-xl px-6 py-3 text-sm`}
          >
            View order status
          </a>
        ) : null}
      </AccountSection>

      <Link
        to="/account/orders"
        prefetch="intent"
        className="text-sm font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
      >
        ← Back to orders
      </Link>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <tr>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {lineItem?.image ? (
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image data={lineItem.image} width={64} height={64} />
            </div>
          ) : null}
          <div>
            <p className="font-medium text-neutral-900">{lineItem.title}</p>
            {lineItem.variantTitle ? (
              <p className="text-xs text-neutral-500">{lineItem.variantTitle}</p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 tabular-nums text-neutral-700">
        <Money data={lineItem.price!} />
      </td>
      <td className="px-4 py-4 text-neutral-700">{lineItem.quantity}</td>
      <td className="px-4 py-4 tabular-nums text-neutral-900">
        <Money data={lineItem.totalDiscount!} />
      </td>
    </tr>
  );
}
