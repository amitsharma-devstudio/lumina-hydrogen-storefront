import {Link} from '~/components/Link';
import {
  sellingPlanLabel,
  type SellingPlanGroupLike,
  type SellingPlanLike,
} from '~/lib/sellingPlan';
import {useLocation} from 'react-router';

type VariantWithPlans = {
  id?: string;
  sellingPlanAllocations?: {
    nodes: Array<{sellingPlan: {id: string}}>;
  } | null;
} | null;

type SellingPlanPurchaseOptionsProps = {
  sellingPlanGroups: {nodes: SellingPlanGroupLike[]} | null | undefined;
  selectedSellingPlan: SellingPlanLike | null;
  selectedVariant: VariantWithPlans;
};

function buildPlanUrl(
  pathname: string,
  search: string,
  sellingPlanId: string | null,
) {
  const params = new URLSearchParams(search);
  if (sellingPlanId) {
    params.set('selling_plan', sellingPlanId);
    params.delete('purchase');
  } else {
    params.delete('selling_plan');
    // Explicit one-time so we don't re-default from a cart subscription
    params.set('purchase', 'once');
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * One-time vs subscribe purchase options for PDP.
 * Selection is stored in the `selling_plan` URL param.
 */
export function SellingPlanPurchaseOptions({
  sellingPlanGroups,
  selectedSellingPlan,
  selectedVariant,
}: SellingPlanPurchaseOptionsProps) {
  const {pathname, search} = useLocation();

  const allocationIds = new Set(
    selectedVariant?.sellingPlanAllocations?.nodes.map(
      (node) => node.sellingPlan.id,
    ) ?? [],
  );

  const groups = (sellingPlanGroups?.nodes ?? [])
    .map((group) => ({
      ...group,
      sellingPlans: {
        nodes: group.sellingPlans.nodes.filter((plan) =>
          allocationIds.has(plan.id),
        ),
      },
    }))
    .filter((group) => group.sellingPlans.nodes.length > 0);

  if (!groups.length) return null;

  const allPlans = groups.flatMap((group) => group.sellingPlans.nodes);
  const isSubscribe = Boolean(selectedSellingPlan);
  const oneTimeUrl = buildPlanUrl(pathname, search, null);
  const defaultSubscribeUrl = buildPlanUrl(
    pathname,
    search,
    selectedSellingPlan?.id ?? allPlans[0]?.id ?? null,
  );

  const optionClass = (selected: boolean) =>
    [
      'selling-plan-option flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left no-underline transition',
      selected
        ? 'border-primary bg-brand-50/50'
        : 'border-neutral-200 bg-white hover:border-neutral-300',
    ].join(' ');

  return (
    <fieldset className="m-0 space-y-3 border-0 p-0">
      <legend className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
        Purchase options
      </legend>

      <Link
        to={oneTimeUrl}
        prefetch="intent"
        preventScrollReset
        replace
        className={optionClass(!isSubscribe)}
        aria-current={!isSubscribe ? 'true' : undefined}
      >
        <span
          className={`mt-0.5 inline-flex h-4 w-4 shrink-0 rounded-full border ${
            !isSubscribe
              ? 'border-primary bg-primary'
              : 'border-neutral-300 bg-white'
          }`}
          aria-hidden
        />
        <span>
          <span className="block text-sm font-medium text-neutral-900">
            One-time purchase
          </span>
          <span className="mt-0.5 block text-xs text-neutral-500">
            Buy once at the listed price
          </span>
        </span>
      </Link>

      <div className={`${optionClass(isSubscribe)} flex-col`}>
        <Link
          to={defaultSubscribeUrl}
          prefetch="intent"
          preventScrollReset
          replace
          className="selling-plan-option flex w-full items-start gap-3 no-underline"
          aria-current={isSubscribe ? 'true' : undefined}
        >
          <span
            className={`mt-0.5 inline-flex h-4 w-4 shrink-0 rounded-full border ${
              isSubscribe
                ? 'border-primary bg-primary'
                : 'border-neutral-300 bg-white'
            }`}
            aria-hidden
          />
          <span>
            <span className="block text-sm font-medium text-neutral-900">
              Subscribe &amp; save
            </span>
            <span className="mt-0.5 block text-xs text-neutral-500">
              Recurring delivery — cancel anytime in your account
            </span>
          </span>
        </Link>

        {isSubscribe ? (
          <div className="mt-3 flex flex-wrap gap-2 pl-7">
            {groups.map((group) =>
              group.sellingPlans.nodes.map((plan) => {
                const selected = selectedSellingPlan?.id === plan.id;
                return (
                  <Link
                    key={plan.id}
                    to={buildPlanUrl(pathname, search, plan.id)}
                    prefetch="intent"
                    preventScrollReset
                    replace
                    className={[
                      'selling-plan-chip rounded-full border px-3.5 py-1.5 text-xs no-underline transition',
                      selected
                        ? 'selling-plan-chip--active border-primary bg-primary'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-300',
                    ].join(' ')}
                  >
                    {sellingPlanLabel(plan)}
                  </Link>
                );
              }),
            )}
          </div>
        ) : null}
      </div>
    </fieldset>
  );
}
