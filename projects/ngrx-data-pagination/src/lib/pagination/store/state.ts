import { EntityId } from '../entity-id';

export interface PaginationContextState {
  // storing entity ids instead of enities allows the programmer
  // to teardown resources separately from pagination
  pages: EntityId[][];
  fetchingNextPage: boolean;
}

export interface PaginationState {
  contexts: { [contextId: string]: PaginationContextState };
}

export const defaultPaginationContextState: PaginationContextState = {
  pages: [],
  fetchingNextPage: false,
};

export const defaultPaginationState: PaginationState = { contexts: {} };
