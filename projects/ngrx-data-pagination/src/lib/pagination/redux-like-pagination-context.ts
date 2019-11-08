import { AsyncPageGenerator, asyncPageGenerator } from './async-page-generator';
import { PaginationFunction } from './pagination-function';
import { PageIterator } from './page-iterator';
import { Observable } from 'rxjs';
import { PaginationAction, makeActionCreators } from './store/actions';

// assumes paginator reducer is plugged in

/**
 * This is a pagination context usable with Redux, ngrx, or
 * any other similar implementations. It writes to, but does
 * not read from the store. It assumes:
 * 1. `dispatch` dispatches an action to the store
 * 2. TODO this library's reducer has been installed
 */
export class ReduxLikePaginationContext<Entity> {
  private pageIterator: PageIterator<Entity>;
  private actionCreators: ReturnType<typeof makeActionCreators>;

  constructor(
    // Arbitrary. Works best with one ReduxLikePaginationContext per contextId
    contextId: string,

    // For requesting the pages
    paginationFunction: PaginationFunction<Entity, any>,

    // Dispatch an action meant for the PaginationReducer
    private dispatch: (action: PaginationAction) => void,

    // Allow the programmer to store entities as they like
    private onReceivePage: (entities: Entity[]) => void,
  ) {
    this.actionCreators = makeActionCreators(contextId);
    this.dispatch(this.actionCreators.ResetPaginationState());
    this.pageIterator = new PageIterator(paginationFunction);
  }

  async getNextPage(): Promise<Entity[]> {
    this.dispatch(this.actionCreators.GetNextPage());
    const page = await this.pageIterator.getNextPage();
    this.onReceivePage(page);
    this.actionCreators.GetNextPageSuccess(page.map((e: any) => e.id)); // TODO type
    return page;
  }

  [Symbol.asyncIterator] = () => this.pageIterator[Symbol.asyncIterator];
}
