import { EntityCollectionServiceBase } from '@ngrx/data';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AnyEntity } from '../../entity';
import {
  ObservablePaginationFunction,
  observableToPromisePaginationFunction,
} from '../../iterator/pagination-function';
import { PaginationState } from '../../store/state';
import { StorePaginationContext } from '../store-pagination-context';
import {
  AllNgrxPaginationObservables,
  AllNgrxPaginationSelectors,
  allPaginationObservables,
  allPaginationSelectors,
} from './selectors';

/**
 * Adapts `StorePaginationContext` to work with ngrx/data
 */
export class Pagination<Entity extends AnyEntity, NextPageState = any> {
  private storePaginationContext: StorePaginationContext<Entity>;
  public selectors: AllNgrxPaginationSelectors<Entity>;
  public selectors$: AllNgrxPaginationObservables<Entity>;

  constructor(
    contextId: string,
    paginationFunction: ObservablePaginationFunction<Entity, NextPageState>,
    private entityService: EntityCollectionServiceBase<Entity, any>,
    store: Store<any>,
    ngrxDataPaginationStoreKey: string,
    addToCache: boolean,
  ) {
    const dispatch = (action: Action) => store.dispatch(action);

    const onReceivePage = (page: Entity[]) =>
      addToCache ? this.entityService.upsertManyInCache(page) : null;

    const paginationState$ = store.pipe(
      select(ngrxDataPaginationStoreKey),
    ) as Observable<PaginationState>;

    const entityMap$ = entityService.selectors$.entityMap$;

    this.storePaginationContext = new StorePaginationContext(
      contextId,
      observableToPromisePaginationFunction(paginationFunction),
      dispatch,
      onReceivePage,
      paginationState$,
      entityMap$,
    );

    this.selectors = allPaginationSelectors(
      contextId,
      entityService.selectors.selectEntityMap,
    );
    this.selectors$ = allPaginationObservables(store, this.selectors);
  }

  nextPage(): void {
    return this.storePaginationContext.nextPage();
  }

  prevPage(): void {
    return this.storePaginationContext.prevPage();
  }
}
