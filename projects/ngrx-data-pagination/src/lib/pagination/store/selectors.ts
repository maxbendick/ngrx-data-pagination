import { EntityId } from '../entity';
import { PaginationContextState } from './state';

const finalPageIndex = ({ done, pages }: PaginationContextState): number => {
  if (!done || !pages || !pages.length) {
    return null;
  }

  return pages.length - 1;
};

const flatten = <A>(arrays: A[][]): A[] => arrays.reduce((result, as) => result.concat(as))

export const contextSelectors = {
  currentPageIds: ({
    pages,
    currentPage,
  }: PaginationContextState): EntityId[] => (pages ? pages[currentPage] : null),
  allIds: ({ pages }: PaginationContextState): EntityId[] => flatten(pages),
  allPageIds: ({ pages }: PaginationContextState): EntityId[][] => pages,
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
  done: ({ done }: PaginationContextState) => done,
  finalPageIndex,
  onFirstPage: ({ currentPage }: PaginationContextState) => currentPage === 0,
  onFinalPage: (state: PaginationContextState) => {
    const { currentPage } = state;
    const finalIndex = finalPageIndex(state);

    if (typeof finalIndex !== 'number' || typeof currentPage !== 'number') {
      return false;
    }

    return currentPage === finalIndex;
  },
};

export type ContextSelectors = typeof contextSelectors;
