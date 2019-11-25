import { PaginationAction, PaginationActionType as T } from './actions';
import { selectNextPageLoading } from './selectors';
import {
  defaultPaginationContextState,
  defaultPaginationState,
  PaginationContextState,
  PaginationState
} from './state';

export function paginationContextReducer(
  state: PaginationContextState = defaultPaginationContextState,
  action: PaginationAction,
): PaginationContextState {
  switch (action.type) {
    case T.RESET_PAGINATION_STATE:
      return defaultPaginationContextState;

    case T.GET_NEXT_PAGE:
      return {
        ...state,
        loadingNewPage: true,
        progressionCancelled: false,
      };

    case T.GET_NEXT_PAGE_SUCCESS:
      return {
        ...state,
        loadingNewPage: false,
        pages: [...state.pages, action.entityIds],
        currentPage: state.progressionCancelled
          ? state.currentPage
          : state.currentPage + 1,
        done: action.done,
        progressionCancelled: false,
      };

    case T.PREV_PAGE:
      return {
        ...state,
        currentPage: state.currentPage - 1,
        // If the next page is loading when the user goes back,
        // don't progress the page number when the page comes in
        progressionCancelled: selectNextPageLoading(state),
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

export function paginationReducer(
  state: PaginationState = defaultPaginationState,
  action: PaginationAction,
): PaginationState {
  if (!action || !action.type.startsWith('[mb-Pagination]')) {
    return state;
  }

  return {
    ...state,
    contexts: {
      ...state.contexts,
      [action.contextId]: paginationContextReducer(
        state.contexts[action.contextId],
        action,
      ),
    },
  };
};
