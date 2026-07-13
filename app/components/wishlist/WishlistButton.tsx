import {useWishlistOptional} from '~/components/wishlist/WishlistProvider';
import {focusRingClass} from '~/lib/theme';

type WishlistButtonProps = {
  productId: string;
  productHandle: string;
  productTitle: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  className?: string;
  /** Larger control beside ATC on PDP */
  size?: 'sm' | 'md';
};

function HeartIcon({filled}: {filled: boolean}) {
  return (
    <svg
      className={filled ? 'h-[1.05em] w-[1.05em]' : 'h-[1.05em] w-[1.05em]'}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

export function WishlistButton({
  productId,
  productHandle,
  productTitle,
  imageUrl,
  imageAlt,
  className = '',
  size = 'sm',
}: WishlistButtonProps) {
  const wishlist = useWishlistOptional();
  if (!wishlist) return null;

  const saved = wishlist.has(productId);
  const dim =
    size === 'md'
      ? 'h-12 w-12 text-base'
      : 'h-9 w-9 text-sm';

  return (
    <button
      type="button"
      className={[
        'wishlist-button inline-flex items-center justify-center rounded-full border bg-white/95 shadow-sm backdrop-blur-sm transition',
        saved
          ? 'wishlist-button--active border-primary text-primary'
          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900',
        dim,
        focusRingClass,
        className,
      ].join(' ')}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={saved}
      title={saved ? 'Saved to wishlist' : 'Save to wishlist'}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        wishlist.toggle({
          id: productId,
          handle: productHandle,
          title: productTitle,
          imageUrl,
          imageAlt,
        });
      }}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}
