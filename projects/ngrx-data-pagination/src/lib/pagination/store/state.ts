import { EntityId } from '../entity';

export interface PaginationContextState {
  // storing entity ids instead of enities allows the programmer
  // to teardown resources separately from pagination
  pages: EntityId[][];
  fetchingNextPage: boolean;
  currentPage: number;
  done: boolean;
}

export interface PaginationState {
  contexts: { [contextId: string]: PaginationContextState };
}

export const defaultPaginationContextState: PaginationContextState = {
  pages: [],
  fetchingNextPage: false,
  currentPage: -1,
  done: false,
};

export const defaultPaginationState: PaginationState = { contexts: {} };
