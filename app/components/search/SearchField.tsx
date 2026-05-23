import type {ChangeEventHandler, FocusEventHandler, RefObject} from 'react';
import {SearchIcon} from '~/components/search/SearchIcon';
import {btnPrimaryClass} from '~/lib/theme';

type SearchFieldProps = {
  inputRef?: RefObject<HTMLInputElement | null>;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Page hero vs header drawer */
  variant?: 'page' | 'drawer';
  submitLabel?: string;
  /** Drawer: navigate to full search (button type="button") */
  onViewAllClick?: () => void;
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
}: SearchFieldProps) {
  const isPage = variant === 'page';

  const inputClassName = isPage
    ? 'search-field-input min-w-0 flex-1 py-4 pl-2 pr-2 text-base md:text-lg'
    : 'search-field-input min-w-0 flex-1 py-3 pl-1 pr-2 text-sm';

  const wrapperClassName = isPage
    ? 'search-field flex items-center gap-2 rounded-2xl bg-white px-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:px-5'
    : 'search-field flex items-center gap-2 rounded-xl bg-white px-3 shadow-sm';

  const buttonSizeClass = isPage ? 'px-7 py-3.5' : 'px-5 py-2.5 text-xs';

  return (
    <div className={isPage ? 'max-w-3xl' : undefined}>
      <div className={wrapperClassName}>
        <SearchIcon
          className={
            isPage
              ? 'h-5 w-5 shrink-0 text-neutral-400'
              : 'h-4 w-4 shrink-0 text-neutral-400'
          }
        />
        <input
          ref={inputRef}
          className={inputClassName}
          data-search-input
          defaultValue={defaultValue}
          name={name}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          type="text"
          role="searchbox"
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
