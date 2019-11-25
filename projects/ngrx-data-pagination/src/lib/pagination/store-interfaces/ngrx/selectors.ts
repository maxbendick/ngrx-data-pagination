import {
  Store,
  createSelector,
  createFeatureSelector,
  Selector,
  select,
} from '@ngrx/store';
import { PaginationState, PaginationContextState } from '../../store/state';
import { ContextSelectors, contextSelectors } from '../../store/selectors';
import { defaultStoreKey } from './default-store-key';
import { Observable } from 'rxjs';

type PaginationSelectors = {
  [K in keyof ContextSelectors]: Selector<any, ReturnType<ContextSelectors[K]>>;
};

type PaginationObservables = {
  [K in keyof ContextSelectors]: Observable<ReturnType<ContextSelectors[K]>>;
};

const mapKeys = <A>(obj: any, f: any): { [K in keyof A]: any } => {
  const result = {};

  for (const k of Object.keys(obj)) {
    result[k] = f(obj[k]);
  }

  return result as any;
};

export const paginationSelectors = (contextId: string): PaginationSelectors => {
  const paginationState = createFeatureSelector<PaginationState>(
    defaultStoreKey,
  );
  const contextState = createSelector(
    paginationState,
    s => s.contexts[contextId],
  );

  const contextSelector = <A>(f: (s: PaginationContextState) => A) =>
    createSelector(contextState, f);

  return mapKeys(contextSelectors, contextSelector);
};

export const paginationObservables = (
  store: Store<any>,
  selectors: PaginationSelectors,
): PaginationObservables => {
  const sel = <A>(selector: Selector<any, A>) => store.pipe(select(selector));

  return mapKeys(selectors, sel);
};
