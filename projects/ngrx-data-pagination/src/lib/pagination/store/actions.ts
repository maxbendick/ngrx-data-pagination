import { EntityId } from '../entity-id';

export enum PaginationActionType {
  RESET_PAGINATION_STATE = '[PageIterator] Reset Pagination State',
  GET_NEXT_PAGE = '[PageIterator] Get Next Page',
  GET_NEXT_PAGE_SUCCESS = '[PageIterator] Get Next Page Success',
}

export interface PaginationAction {
  type: PaginationActionType;
  contextId: string;
}

export interface ResetPaginationState extends PaginationAction {
  type: PaginationActionType.RESET_PAGINATION_STATE;
}
export interface GetNextPage extends PaginationAction {
  type: PaginationActionType.GET_NEXT_PAGE;
}
export interface GetNextPageSuccess extends PaginationAction {
  type: PaginationActionType.GET_NEXT_PAGE_SUCCESS;
  entityIds: EntityId[];
}

export const makeActionCreators = (contextId: string) => ({
  ResetPaginationState: (): ResetPaginationState => ({
    type: PaginationActionType.RESET_PAGINATION_STATE,
    contextId,
  }),
  GetNextPage: (): GetNextPage => ({
    type: PaginationActionType.GET_NEXT_PAGE,
    contextId,
  }),
  GetNextPageSuccess: (entityIds: EntityId[]): GetNextPageSuccess => ({
    type: PaginationActionType.GET_NEXT_PAGE_SUCCESS,
    contextId,
    entityIds,
  }),
});
