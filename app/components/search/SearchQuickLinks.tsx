import {Link} from 'react-router';
import {BESTSELLERS_COLLECTION_PATH} from '~/lib/storeCollections';

const QUICK_LINKS = [
  {label: 'Shop all', to: '/collections/all'},
  {label: 'Collections', to: '/collections'},
  {label: 'Bestsellers', to: BESTSELLERS_COLLECTION_PATH},
  {label: 'New arrivals', to: '/collections/new-arrivals'},
] as const;

export function SearchQuickLinks() {
  return (
    <div className="mt-8">
      <p className="mb-3 text-xs uppercase tracking-[0.15em] text-neutral-500">
        Popular
      </p>
      <ul className="flex flex-wrap gap-2">
        {QUICK_LINKS.map(({label, to}) => (
          <li key={to}>
            <Link
              to={to}
              prefetch="intent"
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-foreground transition-colors hover:border-primary"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
