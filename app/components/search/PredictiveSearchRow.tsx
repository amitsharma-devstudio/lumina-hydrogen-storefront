import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

type PredictiveImage = {
  url?: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function PredictiveSearchRow({
  to,
  title,
  image,
  price,
  onNavigate,
}: {
  to: string;
  title: string;
  image?: PredictiveImage | null;
  price?: {amount: string; currencyCode: CurrencyCode} | null;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={onNavigate}
        prefetch="intent"
        className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-3 transition-colors hover:border-primary/25 hover:bg-neutral-50/60"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
          {image?.url ? (
            <Image
              alt={image.altText ?? title}
              src={image.url}
              width={56}
              height={56}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <span className="text-[9px] uppercase tracking-widest text-neutral-300">
              —
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-neutral-900 group-hover:text-black">
            {title}
          </p>
          {price ? (
            <Money
              data={price}
              className="mt-1 text-sm font-light tabular-nums text-neutral-600"
            />
          ) : null}
        </div>
      </Link>
    </li>
  );
}

export function PredictiveSearchTextRow({
  to,
  title,
  onNavigate,
}: {
  to: string;
  title: string;
  onNavigate: () => void;
}) {
  return (
    <li className="border-t border-neutral-100 first:border-t-0">
      <Link
        to={to}
        onClick={onNavigate}
        prefetch="intent"
        className="group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50/80"
      >
        <span className="line-clamp-2 text-sm font-medium text-neutral-800 group-hover:text-black">
          {title}
        </span>
        <span
          className="shrink-0 text-neutral-300 group-hover:text-primary"
          aria-hidden
        >
          →
        </span>
      </Link>
    </li>
  );
}
