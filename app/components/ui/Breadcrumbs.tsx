
import {Link} from '~/components/Link';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export function Breadcrumbs({items}: {items: BreadcrumbItem[]}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center">
              {index > 0 ? (
                <span className="mx-1.5 text-neutral-300" aria-hidden>
                  /
                </span>
              ) : null}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  prefetch="intent"
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'font-medium text-neutral-900' : undefined}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
