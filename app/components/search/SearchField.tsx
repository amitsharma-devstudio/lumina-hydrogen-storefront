import type {
  ChangeEventHandler,
  FocusEventHandler,
  Ref,
} from 'react';
import {SearchIcon} from '~/components/search/SearchIcon';
import {btnPrimaryClass} from '~/lib/theme';

type SearchFieldProps = {
  inputRef?: Ref<HTMLInputElement>;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Full /search page, predictive modal, or compact header bar */
  variant?: 'page' | 'modal' | 'header';
  submitLabel?: string;
  /** Navigate to full search (button type="button") */
  onViewAllClick?: () => void;
  ariaControls?: string;
  ariaExpanded?: boolean;
};

const searchSubmitClass = [
  btnPrimaryClass,
  'shrink-0 rounded-full !bg-primary !text-[#fff]',
  'hover:!bg-primary-hover hover:!text-[#fff]',
  'disabled:!text-[#fff]',
].join(' ');

export function SearchField({
  inputRef,
  name = 'q',
  defaultValue,
  placeholder = 'Search products, serums, cleansers…',
  onChange,
  onFocus,
  variant = 'page',
  submitLabel = 'Search',
  onViewAllClick,
  ariaControls,
  ariaExpanded,
}: SearchFieldProps) {
  const isPage = variant === 'page';
  const isHeader = variant === 'header';

  const inputClassName = isPage
    ? 'search-field-input min-w-0 flex-1 py-4 pl-2 pr-2 text-base md:text-lg'
    : isHeader
      ? 'search-field-input min-w-0 flex-1 py-2 pl-1 pr-2 text-sm'
      : 'search-field-input min-w-0 flex-1 py-3.5 pl-1 pr-2 text-base';

  const wrapperClassName = isPage
    ? 'search-field flex items-center gap-2 rounded-2xl bg-white px-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:px-5'
    : isHeader
      ? 'search-field flex h-11 w-full items-center gap-2 rounded-full border border-neutral-200/90 bg-neutral-50/90 pl-4 pr-0 focus-within:border-neutral-300 focus-within:bg-white'
      : 'search-field flex items-center gap-2 rounded-2xl border border-neutral-200/80 bg-neutral-50/80 px-4 focus-within:border-neutral-300 focus-within:bg-white';

  const buttonSizeClass = isPage
    ? 'px-7 py-3.5'
    : isHeader
      ? 'ml-auto !h-9 min-h-9 shrink-0 px-5 text-xs shadow-none hover:translate-y-0'
      : 'px-5 py-2.5 text-sm';

  return (
    <div className={isPage ? 'max-w-3xl' : 'w-full'}>
      <div className={wrapperClassName}>
        {!isHeader ? (
          <SearchIcon className="h-5 w-5 shrink-0 text-neutral-400" />
        ) : null}
        <input
          ref={inputRef}
          className={inputClassName}
          data-search-input
          defaultValue={defaultValue}
          name={name}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          type="search"
          role="searchbox"
          aria-controls={ariaControls}
          aria-expanded={ariaExpanded}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
        />
        {onViewAllClick ? (
          <button
            type="button"
            className={`${searchSubmitClass} ${buttonSizeClass}`}
            onClick={onViewAllClick}
          >
            {submitLabel}
          </button>
        ) : (
          <button
            type="submit"
            className={`${searchSubmitClass} ${buttonSizeClass}`}
          >
            {submitLabel}
          </button>
        )}
      </div>
      {isPage ? (
        <p className="mt-3 text-xs tracking-wide text-neutral-400">
          Press{' '}
          <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] text-neutral-600">
            ⌘
          </kbd>
          <kbd className="ml-0.5 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] text-neutral-600">
            K
          </kbd>{' '}
          anywhere to focus search
        </p>
      ) : null}
    </div>
  );
}
