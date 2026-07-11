import {Form, useLocation} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {
  SUPPORTED_LOCALES,
  useSelectedLocale,
  getPathWithoutLocale,
  type Locale,
} from '~/lib/i18n';
import {focusRingClass} from '~/lib/theme';

/**
 * Market / country selector. Updates cart buyer identity and redirects
 * to the same path under the chosen locale prefix.
 */
export function CountrySelector() {
  const selectedLocale = useSelectedLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const triggerId = useId();

  const label = selectedLocale?.label ?? 'Market';

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <span id={triggerId} className="sr-only">
        Choose market
      </span>
      <button
        type="button"
        className={`inline-flex h-10 max-w-[9.5rem] items-center gap-1.5 rounded-full border border-transparent px-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-600 transition-colors hover:border-neutral-200 hover:bg-neutral-50 hover:text-black sm:max-w-[11rem] ${focusRingClass}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={triggerId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <GlobeIcon />
        <span className="min-w-0 truncate">
          {selectedLocale
            ? `${selectedLocale.country} · ${selectedLocale.currency || selectedLocale.language}`
            : 'Market'}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={triggerId}
          className="absolute right-0 z-50 mt-2 min-w-[14rem] overflow-hidden rounded-xl border border-neutral-200/90 bg-white py-1 shadow-[0_16px_40px_rgba(24,21,18,0.14)]"
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <li key={`${locale.language}-${locale.country}`} role="presentation">
              <LocaleForm
                locale={locale}
                selected={
                  selectedLocale?.language === locale.language &&
                  selectedLocale?.country === locale.country
                }
                onNavigate={() => setOpen(false)}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {label}
      </span>
    </div>
  );
}

function LocaleForm({
  locale,
  selected,
  onNavigate,
}: {
  locale: Locale;
  selected: boolean;
  onNavigate: () => void;
}) {
  const {pathname, search} = useLocation();
  const selectedLocale = useSelectedLocale();

  const pathWithoutLocale = getPathWithoutLocale(pathname, selectedLocale);
  const prefix = locale.pathPrefix.replace(/\/+$/, '');
  const newPath = `${prefix}${pathWithoutLocale}${search}` || '/';
  const action = `${prefix}/cart`;

  const variables = {
    action: CartForm.ACTIONS.BuyerIdentityUpdate,
    inputs: {
      buyerIdentity: {
        countryCode: locale.country.toUpperCase(),
      },
    },
  };

  return (
    <Form method="POST" action={action} className="block" onSubmit={onNavigate}>
      <input type="hidden" name="redirectTo" value={newPath} />
      <input
        type="hidden"
        name="cartFormInput"
        value={JSON.stringify(variables)}
      />
      <button
        type="submit"
        role="option"
        aria-selected={selected}
        className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50 ${
          selected ? 'bg-brand-50/80 font-medium text-primary' : 'text-neutral-800'
        }`}
      >
        <span>{locale.label}</span>
        {selected ? (
          <span className="text-[10px] uppercase tracking-[0.12em] text-primary">
            Current
          </span>
        ) : null}
      </button>
    </Form>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  );
}

function ChevronIcon({open}: {open: boolean}) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
