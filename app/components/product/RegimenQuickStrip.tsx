
import {Link} from '~/components/Link';
import type {RegimenDisplay} from '~/lib/skincare';

/**
 * Compact PDP strip powered by `lumina_regimen` metaobject.
 * Full carousel lives in CompleteTheRoutine below the fold.
 */
export function RegimenQuickStrip({
  regimen,
  currentHandle,
}: {
  regimen: RegimenDisplay;
  currentHandle: string;
}) {
  if (!regimen.products.length) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            From metaobject · lumina_regimen
          </p>
          <h3 className="text-sm font-medium text-black">{regimen.title}</h3>
        </div>
        <a
          href="#complete-routine"
          className="text-xs font-medium text-neutral-600 underline-offset-2 hover:text-black hover:underline"
        >
          View full routine ↓
        </a>
      </div>

      {regimen.description ? (
        <p className="mb-3 text-xs leading-relaxed text-neutral-600">
          {regimen.description}
        </p>
      ) : null}

      <ol className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        {regimen.products.map((item) => {
          const isCurrent = item.handle === currentHandle;

          return (
            <li key={item.id} className="min-w-0 flex-1">
              <Link
                to={`/products/${item.handle}`}
                prefetch="intent"
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                  isCurrent
                    ? 'border-primary bg-white shadow-sm'
                    : 'border-neutral-200 bg-white hover:border-primary/40'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-full text-[9px] font-bold leading-tight ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <span>{item.step}</span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-black">
                    {item.title}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-neutral-500">
                    {isCurrent ? 'You are here' : item.category}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
