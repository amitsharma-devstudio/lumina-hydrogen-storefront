import {useEffect, useId, useRef, useState} from 'react';
import {controlHeightClass, focusRingClass} from '~/lib/theme';

export type ThemedDropdownOption = {
  value: string;
  label: string;
};

type ThemedDropdownProps = {
  label: string;
  value: string;
  options: readonly ThemedDropdownOption[];
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
};

export function ThemedDropdown({
  label,
  value,
  options,
  onChange,
  className = 'w-full md:w-[260px]',
  triggerClassName = '',
}: ThemedDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const triggerId = useId();
  const selected = options.find((o) => o.value === value);

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
    <div ref={rootRef} className={`themed-dropdown relative ${className}`}>
      <span id={triggerId} className="sr-only">
        {label}
      </span>
      <button
        type="button"
        className={`themed-dropdown-trigger ${controlHeightClass} ${focusRingClass} ${triggerClassName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={triggerId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {selected?.label ?? label}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={triggerId}
          className="themed-dropdown-menu"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`themed-dropdown-option ${isSelected ? 'themed-dropdown-option--selected' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ChevronIcon({open}: {open: boolean}) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
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
