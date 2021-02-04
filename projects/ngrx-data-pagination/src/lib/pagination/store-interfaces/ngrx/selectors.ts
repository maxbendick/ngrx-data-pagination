import { Dictionary } from '@ngrx/entity';
import {
  createFeatureSelector,
  createSelector,
  select,
  Selector,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import { ContextSelectors, contextSelectors } from '../../store/selectors';
import { PaginationContextState, PaginationState } from '../../store/state';
import { defaultStoreKey } from './default-store-key';

// These selections require knowledge of the entity cache
interface AdvancedSelections<Entity> {
  page: Entity[] | null;
  all: Entity[] | null;
}

export type BasicNgrxPaginationSelectors = {
  [K in keyof ContextSelectors]: Selector<any, ReturnType<ContextSelectors[K]>>;
};

type AdvancedNgrxPaginationSelectors<Entity> = {
  [K in keyof AdvancedSelections<Entity>]: Selector<
    any,
    AdvancedSelections<Entity>[K]
  >;
};

export type AllNgrxPaginationSelectors<Entity> = BasicNgrxPaginationSelectors &
  AdvancedNgrxPaginationSelectors<Entity>;

export type BasicNgrxPaginationObservables = {
  [K in keyof ContextSelectors]: Observable<ReturnType<ContextSelectors[K]>>;
};

type AdvancedNgrxPaginationObservables<Entity> = {
  [K in keyof AdvancedSelections<Entity>]: Observable<
    AdvancedSelections<Entity>[K]
  >;
};

export type AllNgrxPaginationObservables<
  Entity
> = BasicNgrxPaginationObservables & AdvancedNgrxPaginationObservables<Entity>;

const mapValues = <A>(obj: any, f: any): { [K in keyof A]: any } => {
  const result = {};

  for (const k of Object.keys(obj)) {
    result[k] = f(obj[k]);
  }

  return result as any;
};

/**
 * Creates pagination selectors that only know about the pagination state
 */
const basicPaginationSelectors = (
  contextId: string,
): BasicNgrxPaginationSelectors => {
  const paginationState = createFeatureSelector<PaginationState>(
    defaultStoreKey,
  );
  const contextState = createSelector(
    paginationState,
    s => s.contexts[contextId],
  );

  const contextSelector = <A>(f: (s: PaginationContextState) => A) =>
    createSelector(contextState, f);

  return mapValues(contextSelectors, contextSelector);
};

/**
 * Creates selectors that know about the entity cache
 */
const advancedPaginationSelectors = <Entity>(
  basicPaginationSelectors: BasicNgrxPaginationSelectors,
  selectEntityMap: Selector<any, Dictionary<Entity>>,
): AdvancedNgrxPaginationSelectors<Entity> => {
  return {
    page: createSelector(
      basicPaginationSelectors.currentPageIds,
      selectEntityMap,
      (ids, entityMap) => {
        if (!ids || !entityMap) {
          return null;
        }
        return ids.reduce((a, id) => {
          if (id in entityMap) {
            a.push(entityMap[id]);
          }
          return a;
        }, []);
      },
    ),
    all: createSelector(
      basicPaginationSelectors.allIds,
      selectEntityMap,
      (allIds, entityMap) => {
        if (!allIds || !entityMap) {
          return null;
        }
        return allIds.map(id => entityMap[id]);
      },
    ),
  };
};

export const allPaginationSelectors = <Entity>(
  contextId: string,
  selectEntityMap: Selector<any, Dictionary<Entity>>,
) => {
  const basicSelectors = basicPaginationSelectors(contextId);
  const advancedSelectors = advancedPaginationSelectors(
    basicSelectors,
    selectEntityMap,
  );
  return {
    ...basicSelectors,
    ...advancedSelectors,
  };
};

export const allPaginationObservables = <Entity>(
  store: Store<any>,
  allSelectors: AllNgrxPaginationSelectors<Entity>,
): AllNgrxPaginationObservables<Entity> => {
  const sel = <A>(selector: Selector<any, A>) => store.pipe(select(selector));
  return mapValues(allSelectors, sel);
};
