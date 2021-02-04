import { EntityCollectionServiceBase, EntityOp } from '@ngrx/data';
import { Action, select, Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
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

    const onReceivePage = (page: Entity[]): void => {
      if (!addToCache) {
        return;
      }
      this.entityService.upsertManyInCache(page);
      this.entityService.createAndDispatch(EntityOp.SAVE_UPSERT_MANY_SUCCESS, page);
    };

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

  /** Not yet cancellable! Use with caution. */
  _loadAllPages(): Observable<unknown> {
    return from(this._loadAllPagesP()).pipe(take(1));
  }

  private async _loadAllPagesP() {
    // wait until not loading
    await this.selectors$.nextPageLoading
      .pipe(
        filter(loading => !loading),
        take(1),
      )
      .toPromise();

    // start the next-page request
    this.nextPage();

    // wait until not loading, again
    await this.selectors$.nextPageLoading
      .pipe(
        filter(loading => !loading),
        take(1),
      )
      .toPromise();

    const done = await this.selectors$.done
      .pipe(take(1))
      .toPromise();

    if (done) {
      // done case: let the whole function return
      return;
    }

    // recursive case: not done, so recurse
    return this._loadAllPages();
  }
}
