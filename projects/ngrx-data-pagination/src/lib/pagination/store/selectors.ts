import { EntityId } from '../entity';
import { PaginationContextState } from './state';

export const selectCurrentPageIds = ({
  pages,
  currentPage,
}: PaginationContextState): EntityId[] => pages[currentPage];

export const selectNextPageLoaded = ({
  pages,
  currentPage,
}: PaginationContextState): boolean => !!pages[currentPage + 1];

export const selectNextPageLoading = ({
  pages,
  currentPage,
  fetchingNextPage,
}: PaginationContextState): boolean =>
  !!pages[currentPage + 1] && fetchingNextPage;
