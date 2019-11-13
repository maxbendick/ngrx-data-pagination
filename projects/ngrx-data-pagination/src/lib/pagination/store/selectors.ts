import { EntityId } from '../entity';
import { PaginationContextState } from './state';

export const selectCurrentPageIds = ({
  pages,
  currentPage,
}: PaginationContextState): EntityId[] => (pages ? pages[currentPage] : null);

export const selectNextPageLoaded = ({
  pages,
  currentPage,
}: PaginationContextState): boolean => !!pages[currentPage + 1];

export const selectNextPageLoading = ({
  pages,
  currentPage,
  loadingNewPage,
}: PaginationContextState): boolean =>
  !pages[currentPage + 1] && loadingNewPage;

export const selectLoadingNewPage = ({
  loadingNewPage,
}: PaginationContextState): boolean => loadingNewPage;

export const selectPageNumber = ({
  currentPage,
}: PaginationContextState): number => (currentPage >= 0 ? currentPage : null);
