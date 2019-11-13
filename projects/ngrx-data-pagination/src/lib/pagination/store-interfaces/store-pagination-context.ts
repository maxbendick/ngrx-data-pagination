import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AnyEntity, EntityId, EntityMap } from '../entity';
import { PageIterator } from '../iterator/page-iterator';
import { PaginationFunction } from '../iterator/pagination-function';
import { makeDispatchers, PaginationActionT } from '../store/actions';
import {
  selectCurrentPageIds,
  selectNextPageLoaded,
  selectNextPageLoading,
} from '../store/selectors';
import { defaultPaginationContextState, PaginationState } from '../store/state';

// assumes paginator reducer is plugged in

/**
 * This is a pagination context usable with Redux, ngrx, or
 * any other similar implementations. It writes to, but does
 * not read from the store. It assumes:
 * 1. `dispatch` dispatches an action to the store
 * 2. TODO this library's reducer has been installed
 */
export class StorePaginationContext<Entity extends AnyEntity> {
  private pageIterator: PageIterator<Entity>;
  private dispatchers: ReturnType<typeof makeDispatchers>;
  private state = defaultPaginationContextState;
  private entityMap = {};
  private entityMap$: Observable<EntityMap<Entity>>;
  private subscription = new Subscription();

  constructor(
    // Arbitrary. For now, only use one ReduxLikePaginationContext per contextId
    contextId: string,

    // For requesting the pages
    paginationFunction: PaginationFunction<Entity, any>,

    // Dispatch an action meant for the PaginationReducer
    dispatch: (action: PaginationActionT) => void,

    // Allow the programmer to store entities as they like
    private onReceivePage: (entities: Entity[]) => void,

    state$: Observable<PaginationState>,
    entityMap$: Observable<EntityMap<Entity>>,
  ) {
    this.dispatchers = makeDispatchers(contextId, dispatch);
    this.dispatchers.ResetPaginationState();
    this.pageIterator = new PageIterator(paginationFunction);

    const stateSubscription = state$
      .pipe(
        map(state =>
          state ? state.contexts[contextId] : defaultPaginationContextState,
        ),
      )
      .subscribe(state => {
        this.state = state;
      });

    this.entityMap$ = entityMap$.pipe(shareReplay(1));

    const entityMapSubscription = this.entityMap$.subscribe(entityMap => {
      this.entityMap = entityMap;
    });

    this.subscription.add(stateSubscription);
    this.subscription.add(entityMapSubscription);
  }

  async getNextPageP(): Promise<Entity[]> {
    const nextPageLoaded = selectNextPageLoaded(this.state);
    if (nextPageLoaded) {
      this.incrementCurrentPage();
      return;
    }

    this.dispatchers.GetNextPage();
    const page = await this.pageIterator.getNextPage();
    this.onReceivePage(page);

    if (!page) {
      throw new Error('bad page in getNextPageP');
    }

    this.dispatchers.GetNextPageSuccess(
      page.map((e: any) => e.id),
      this.pageIterator.done,
    );
    return page;
  }

  nextPage() {
    this.getNextPageP();
  }

  prevPage() {
    if (this.state.currentPage <= 0) {
      throw new Error('Cannot go back from page 0');
    }
    this.dispatchers.PrevPage();
  }

  private incrementCurrentPage() {
    this.dispatchers.NextPage();
  }

  get currentPage$(): Observable<Entity[] | null> {
    const { currentPageIds } = this;

    return this.entityMap$.pipe(
      map(entityMap =>
        currentPageIds
          ? currentPageIds.map(entityId => entityMap[entityId])
          : null,
      ),
    );
  }

  get nextPageLoading(): boolean {
    return selectNextPageLoading(this.state);
  }

  get nextPageLoaded(): boolean {
    return selectNextPageLoaded(this.state);
  }

  get currentPageIds(): EntityId[] {
    return selectCurrentPageIds(this.state);
  }

  destroy() {
    this.subscription.unsubscribe();
  }

  [Symbol.asyncIterator] = () => this.pageIterator[Symbol.asyncIterator];
}
