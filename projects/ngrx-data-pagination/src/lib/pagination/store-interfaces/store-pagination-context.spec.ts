import { of } from 'rxjs';
import { waitMs } from '../../../test-utils';
import { PaginationFunction } from '../iterator/pagination-function';
import { PaginationState } from '../store/state';
import { StorePaginationContext } from './store-pagination-context';
import { EntityMap } from '../entity';
import { ResetPaginationState, GetNextPage, GetNextPageSuccess } from '../store/actions';

interface TestEntity {
  id: number;
}

const testEntity = (id: number): TestEntity => ({ id });

describe('StorePaginationContext', () => {
  describe('scenario 1', () => {
    const contextId = 'a context id';
    const waitTimeMs = 10;
    const paginationFunction: PaginationFunction<
      TestEntity,
      { pageNumber: number }
    > = async state => {
      const pageNumber = state ? state.pageNumber : 1;
      const res: TestEntity[] = [];
      for (let i = 0; i < pageNumber; i++) {
        res.push(testEntity(i));
      }
      await waitMs(waitTimeMs);
      return {
        state: { pageNumber: pageNumber + 1 },
        data: res,
        done: pageNumber > 3,
      };
    };

    const state$ = of<PaginationState>();
    const entityMap$ = of<EntityMap<TestEntity>>();

    let dispatch: (a: any) => void;
    let onReceivePage: (a: TestEntity[]) => void;
    let context: StorePaginationContext<TestEntity>;
    let dispatched: any[];
    let pagesReceived: TestEntity[][];

    beforeEach(() => {
      dispatched = [];
      pagesReceived = [];
      dispatch = (action: any) => {
        dispatched.push(action);
      };
      onReceivePage = (page: any) => {
        pagesReceived.push(page);
      };

      context = new StorePaginationContext(
        contextId,
        paginationFunction,
        dispatch,
        onReceivePage,
        state$,
        entityMap$,
      );
    });

    it('creates', () => {
      expect(context.getNextPageP).toBeTruthy();
    });

    it('gets the pages in order', async () => {
      const page1 = await context.getNextPageP();
      expect(page1).toEqual([0].map(testEntity));

      const page2 = await context.getNextPageP();
      expect(page2).toEqual([0, 1].map(testEntity));

      const page3 = await context.getNextPageP();
      expect(page3).toEqual([0, 1, 2].map(testEntity));
    });

    // TODO make work
    xit('dispatches to go to forward', async () => {
      const resetAction = new ResetPaginationState(contextId);
      const getNextPageAction = new GetNextPage(contextId);
      const getNextPageSuccessAction1 = new GetNextPageSuccess(contextId, [0], false);
      const getNextPageSuccessAction2 = new GetNextPageSuccess(contextId, [0, 1], false);

      expect(dispatched).toEqual([resetAction]);

      // get page 1

      const pagePromise1 = context.getNextPageP();

      expect(dispatched).toEqual([resetAction, getNextPageAction]);

      const page1 = await pagePromise1;
      expect(page1).toEqual([0].map(testEntity));

      expect(dispatched).toEqual([
        resetAction,
        getNextPageAction,
        getNextPageSuccessAction1,
      ]);

      // get page 2

      const pagePromise2 = context.getNextPageP();

      expect(dispatched).toEqual([
        resetAction,
        getNextPageAction,
        getNextPageSuccessAction1,
        getNextPageAction,
      ]);

      const page2 = await pagePromise2;
      expect(page2).toEqual([0, 1].map(testEntity));

      expect(dispatched).toEqual([
        resetAction,
        getNextPageAction,
        getNextPageSuccessAction1,
        getNextPageAction,
        getNextPageSuccessAction2,
      ]);
    });

    it('emits entities', async () => {
      const page1 = await context.getNextPageP();
      expect(page1).toEqual([0].map(testEntity));
      expect(pagesReceived).toEqual([[0].map(testEntity)]);

      const page2 = await context.getNextPageP();
      expect(page2).toEqual([0, 1].map(testEntity));
      expect(pagesReceived).toEqual([[0], [0, 1]].map(a => a.map(testEntity)));

      const page3 = await context.getNextPageP();
      expect(page3).toEqual([0, 1, 2].map(testEntity));
      expect(pagesReceived).toEqual(
        [[0], [0, 1], [0, 1, 2]].map(a => a.map(testEntity)),
      );
    });
  });
});
