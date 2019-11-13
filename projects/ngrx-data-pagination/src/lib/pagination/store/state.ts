import { EntityId } from '../entity';

export interface PaginationContextState {
  // storing entity ids instead of enities allows the programmer
  // to teardown resources separately from pagination
  pages: EntityId[][];
  loadingNewPage: boolean;
  currentPage: number;
  done: boolean;
  progressionCancelled: boolean; // cancels the automatic page progression when a new page is loaded
}

export interface PaginationState {
  contexts: { [contextId: string]: PaginationContextState };
}

export const defaultPaginationContextState: PaginationContextState = {
  pages: [],
  loadingNewPage: false,
  currentPage: -1,
  done: false,
  progressionCancelled: false,
};

export const defaultPaginationState: PaginationState = { contexts: {} };
