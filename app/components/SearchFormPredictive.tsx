import {
  useFetcher,
  useNavigate,
  type FormProps,
  type Fetcher,
} from 'react-router';
import React, {useRef} from 'react';
import type {PredictiveSearchReturn} from '~/lib/search';
import {useAside} from './Aside';

type SearchFormPredictiveChildren = (args: {
  fetchResults: (value: string) => void;
  goToSearch: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  fetcher: Fetcher<PredictiveSearchReturn>;
}) => React.ReactNode;

type SearchFormPredictiveProps = Omit<FormProps, 'children'> & {
  children: SearchFormPredictiveChildren | null;
};

export const SEARCH_ENDPOINT = '/search';

/**
 * Search form that sends predictive requests to the `/search` route.
 */
export function SearchFormPredictive({
  children,
  className = 'predictive-search-form',
  ...props
}: SearchFormPredictiveProps) {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const aside = useAside();

  /** Navigate to the search page with the current input value */
  function goToSearch() {
    const term = inputRef?.current?.value?.trim();
    void navigate(
      SEARCH_ENDPOINT + (term ? `?q=${encodeURIComponent(term)}` : ''),
    );
    aside.close();
  }

  /** Fetch predictive suggestions for the given query */
  function fetchResults(value: string) {
    void fetcher.submit(
      {q: value || '', limit: 5, predictive: true},
      {method: 'GET', action: SEARCH_ENDPOINT},
    );
  }

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <fetcher.Form
      {...props}
      autoComplete="off"
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        goToSearch();
      }}
    >
      {children({inputRef, fetcher, fetchResults, goToSearch})}
    </fetcher.Form>
  );
}
