import { EntityCollectionServiceBase } from '@ngrx/data';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnyEntity } from '../../entity';
import { PaginationFunction } from '../../iterator/pagination-function';
import { PaginationContextState, PaginationState, defaultPaginationContextState } from '../../store/state';
import { StorePaginationContext } from '../store-pagination-context';

// // Arbitrary. Works best with one ReduxLikePaginationContext per contextId
// contextId: string,

// // For requesting the pages
// paginationFunction: PaginationFunction<Entity, any>,

// // Dispatch an action meant for the PaginationReducer
// dispatch: (action: PaginationActionT) => void,

// // Allow the programmer to store entities as they like
// private onReceivePage: (entities: Entity[]) => void,

// state$: Observable<PaginationState>,
// entityMap$: Observable<EntityMap<Entity>>,

export class NgrxDataPaginationContext<
  Entity extends AnyEntity,
  NextPageState
> {
  private storePaginationContext: StorePaginationContext<Entity>;
  private state$: Observable<PaginationContextState>;

  constructor(
    contextId: string,
    paginationFunction: PaginationFunction<Entity, NextPageState>,
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
      map(paginationState => paginationState.contexts[contextId] || defaultPaginationContextState),
    );

    const entityMap$ = entityService.selectors$.entityMap$;

    this.storePaginationContext = new StorePaginationContext(
      contextId,
      paginationFunction,
      dispatch,
      onReceivePage,
      paginationState$,
      entityMap$,
    );
  }

  get currentPage$() {
    return this.storePaginationContext.currentPage$;
  }

  get pageNumber$() {
    return this.state$.pipe(map(({ currentPage }) => currentPage));
  }

  nextPage() {
    return this.storePaginationContext.nextPage();
  }

  prevPage() {
    return this.storePaginationContext.prevPage();
  }
}
