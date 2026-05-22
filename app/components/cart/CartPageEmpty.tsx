import {Link} from 'react-router';
import {btnPrimaryLinkClass} from '~/lib/theme';

export function CartPageEmpty() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 pt-6 sm:px-6 lg:pt-8">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
          Shopping cart
        </p>
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 lg:text-4xl">
          Your Cart
        </h1>
        <p className="mt-4 max-w-md text-sm text-neutral-500">
          Your bag is empty. Explore our collections to find your next routine
          essential.
        </p>
        <Link
          to="/collections"
          prefetch="intent"
          className={`${btnPrimaryLinkClass} mt-6 inline-flex rounded-xl px-8 text-sm font-medium uppercase tracking-[0.12em]`}
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
