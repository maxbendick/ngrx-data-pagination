import { PaginationAction, PaginationActionType as T } from './actions';
import {
  defaultPaginationContextState,
  defaultPaginationState,
  PaginationContextState,
  PaginationState,
} from './state';

export const paginationContextReducer = (
  state: PaginationContextState = defaultPaginationContextState,
  action: PaginationAction,
) => {
  switch (action.type) {
    case T.RESET_PAGINATION_STATE:
      return defaultPaginationContextState;

    case T.GET_NEXT_PAGE:
      return {
        ...state,
        fetchingNextPage: true,
      };

    case T.GET_NEXT_PAGE_SUCCESS:
      return {
        ...state,
        fetchingNextPage: false,
        pages: [...state.pages, action.entityIds],
        currentPage: state.currentPage + 1,
        done: action.done,
      };

    case T.PREV_PAGE:
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };

    case T.NEXT_PAGE:
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };

    default:
      return state;
  }
};

export const paginationReducer = (
  state: PaginationState = defaultPaginationState,
  action: PaginationAction,
) => {
  for (const contextId of Object.keys(state.contexts)) {
    if (contextId === action.contextId) {
      return {
        ...state,
        [contextId]: paginationContextReducer(
          state.contexts[contextId],
          action,
        ),
      };
    }
  }
  return state;
};
