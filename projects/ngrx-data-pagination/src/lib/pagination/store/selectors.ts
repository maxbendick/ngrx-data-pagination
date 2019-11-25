import { EntityId } from '../entity';
import { PaginationContextState } from './state';

export const contextSelectors = {
  currentPageIds: ({
    pages,
    currentPage,
  }: PaginationContextState): EntityId[] => (pages ? pages[currentPage] : null),
  nextPageLoaded: ({ pages, currentPage }: PaginationContextState): boolean =>
    !!pages[currentPage + 1],
  nextPageLoading: ({
    pages,
    currentPage,
    loadingNewPage,
  }: PaginationContextState): boolean => {
    if (!Number.isInteger(currentPage)) {
      return loadingNewPage;
    }
    return !pages[currentPage + 1] && loadingNewPage;
  },
  loadingNewPage: ({ loadingNewPage }: PaginationContextState): boolean =>
    loadingNewPage,
  pageNumber: ({ currentPage }: PaginationContextState): number =>
    currentPage >= 0 ? currentPage : null,
  done: ({ done }) => done,
};

export type ContextSelectors = typeof contextSelectors;
