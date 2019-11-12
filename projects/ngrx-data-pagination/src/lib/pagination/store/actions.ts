import { EntityId } from '../entity-id';

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

export interface PaginationAction extends Action {
  type: PaginationActionType;
  contextId: string;
}

export class ResetPaginationState implements PaginationAction {
  readonly type = T.RESET_PAGINATION_STATE;
  constructor(public contextId: string) {}
}
export class GetNextPage implements PaginationAction {
  readonly type = T.GET_NEXT_PAGE;
  constructor(public contextId: string) {}
}
export class GetNextPageSuccess implements PaginationAction {
  readonly type = T.GET_NEXT_PAGE_SUCCESS;
  constructor(public contextId: string, public entityIds: EntityId[]) {}
}
export class PrevPage implements PaginationAction {
  readonly type = T.PREV_PAGE;
  constructor(public contextId: string) {}
}
export class NextPage implements PaginationAction {
  readonly type = T.NEXT_PAGE;
  constructor(public contextId: string) {}
}

export const makeActionCreators = (contextId: string) => ({
  ResetPaginationState: () => new ResetPaginationState(contextId),
  GetNextPage: () => new GetNextPage(contextId),
  GetNextPageSuccess: (entityIds: EntityId[]) =>
    new GetNextPageSuccess(contextId, entityIds),
  GetPrevPage: () => new PrevPage(contextId),
  PrevPage: () => new PrevPage(contextId),
  NextPage: () => new NextPage(contextId),
});

export const makeDispatchers = (contextId: string, dispatch: (action: Action) => void) => {
  const actionCreators = makeActionCreators(contextId);

  return {
    ResetPaginationState: () => dispatch(actionCreators.ResetPaginationState()),
    GetNextPage: () => dispatch(actionCreators.GetNextPage()),
    GetNextPageSuccess: (entityIds: EntityId[]) => dispatch(actionCreators.GetNextPageSuccess(entityIds)),
    PrevPage: () => dispatch(actionCreators.PrevPage()),
    NextPage: () => dispatch(actionCreators.NextPage()),
  };
};
