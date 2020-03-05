import { EntityId } from '../entity';

export enum PaginationActionType {
  RESET_PAGINATION_STATE = '[mb-Pagination] Reset Pagination State',
  GET_NEXT_PAGE = '[mb-Pagination] Get Next Page',
  GET_NEXT_PAGE_SUCCESS = '[mb-Pagination] Get Next Page Success',
  PREV_PAGE = '[mb-Pagination] Prev Page',
  NEXT_PAGE = '[mb-Pagination] Next Page',
}

const T = PaginationActionType;

interface Action {
  type: string;
}

export interface PaginationActionT extends Action {
  type: PaginationActionType;
  contextId: string;
}

export class ResetPaginationState implements PaginationActionT {
  readonly type = T.RESET_PAGINATION_STATE;
  constructor(public contextId: string) {}
}
export class GetNextPage implements PaginationActionT {
  readonly type = T.GET_NEXT_PAGE;
  constructor(public contextId: string) {}
}
export class GetNextPageSuccess implements PaginationActionT {
  readonly type = T.GET_NEXT_PAGE_SUCCESS;
  constructor(
    public contextId: string,
    public entityIds: EntityId[],
    public done: boolean,
  ) {}
}
export class PrevPage implements PaginationActionT {
  readonly type = T.PREV_PAGE;
  constructor(public contextId: string) {}
}
export class NextPage implements PaginationActionT {
  readonly type = T.NEXT_PAGE;
  constructor(public contextId: string) {}
}

export type PaginationAction =
  | ResetPaginationState
  | GetNextPage
  | GetNextPageSuccess
  | PrevPage
  | NextPage;

export const makeActionCreators = (contextId: string) => ({
  ResetPaginationState: () => new ResetPaginationState(contextId),
  GetNextPage: () => new GetNextPage(contextId),
  GetNextPageSuccess: (entityIds: EntityId[], done: boolean) =>
    new GetNextPageSuccess(contextId, entityIds, done),
  PrevPage: () => new PrevPage(contextId),
  NextPage: () => new NextPage(contextId),
});

export const makeDispatchers = (
  contextId: string,
  dispatch: (action: Action) => void,
) => {
  const actionCreators = makeActionCreators(contextId);

  return {
    ResetPaginationState: () => dispatch(actionCreators.ResetPaginationState()),
    GetNextPage: () => dispatch(actionCreators.GetNextPage()),
    GetNextPageSuccess: (entityIds: EntityId[], done: boolean) =>
      dispatch(actionCreators.GetNextPageSuccess(entityIds, done)),
    PrevPage: () => dispatch(actionCreators.PrevPage()),
    NextPage: () => dispatch(actionCreators.NextPage()),
  };
};
