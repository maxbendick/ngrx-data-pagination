import { EntityCollectionServiceBase } from '@ngrx/data';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnyEntity } from '../../entity';
import {
  ObservablePaginationFunction,
  observableToPromisePaginationFunction,
} from '../../iterator/pagination-function';
import {
  selectLoadingNewPage,
  selectNextPageLoading,
  selectPageNumber,
} from '../../store/selectors';
import {
  defaultPaginationContextState,
  PaginationContextState,
  PaginationState,
} from '../../store/state';
import { StorePaginationContext } from '../store-pagination-context';
import { paginationSelectors, paginationObservables } from './selectors';

/**
 * Adapts `StorePaginationContext` to work with ngrx/data
 */
export class NgrxDataPagination<Entity extends AnyEntity, NextPageState> {
  private storePaginationContext: StorePaginationContext<Entity>;
  private state$: Observable<PaginationContextState>;
  public selectors: ReturnType<typeof paginationSelectors>;
  public selectors$: ReturnType<typeof paginationObservables>;

  constructor(
    contextId: string,
    paginationFunction: ObservablePaginationFunction<Entity, NextPageState>,
    private entityService: EntityCollectionServiceBase<Entity, any>,
    store: Store<any>,
    ngrxDataPaginationStoreKey: string,
  ) {
    const dispatch = (action: Action) => store.dispatch(action);

    const onReceivePage = (page: Entity[]) =>
      this.entityService.upsertManyInCache(page);

    const paginationState$ = store.pipe(
      select(ngrxDataPaginationStoreKey),
    ) as Observable<PaginationState>;

    this.state$ = paginationState$.pipe(
      map(paginationState => {
        if (!paginationState) {
          return defaultPaginationContextState;
        }
        return (
          paginationState.contexts[contextId] || defaultPaginationContextState
        );
      }),
    );

    const entityMap$ = entityService.selectors$.entityMap$;

    this.storePaginationContext = new StorePaginationContext(
      contextId,
      observableToPromisePaginationFunction(paginationFunction),
      dispatch,
      onReceivePage,
      paginationState$,
      entityMap$,
    );

    this.selectors = paginationSelectors(contextId);
    this.selectors$ = paginationObservables(store, this.selectors);
  }

  get currentPage$(): Observable<Entity[]> {
    return this.storePaginationContext.currentPage$;
  }

  get pageNumber$(): Observable<number> {
    return this.selectors$.pageNumber;
    // return this.state$.pipe(map(selectPageNumber));
  }

  get loadingNextPage$(): Observable<boolean> {
    return this.selectors$.nextPageLoading;
    // return this.state$.pipe(map(selectNextPageLoading));
  }

  get loadingNewPage$(): Observable<boolean> {
    return this.selectors$.loadingNewPage;
    // return this.state$.pipe(map(selectLoadingNewPage));
  }

  get done$(): Observable<boolean> {
    return this.state$.pipe(map(({ done }) => done));
  }

  nextPage(): void {
    return this.storePaginationContext.nextPage();
  }

  prevPage(): void {
    return this.storePaginationContext.prevPage();
  }
}
