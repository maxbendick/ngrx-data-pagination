import { Injectable } from "@angular/core";
import { Store, createSelector, createFeatureSelector, Selector, select } from '@ngrx/store';
import { PaginationState, PaginationContextState } from '../../store/state';
import { selectCurrentPageIds, selectNextPageLoaded, selectNextPageLoading, selectLoadingNewPage, selectPageNumber } from '../../store/selectors';
import { defaultStoreKey } from './default-store-key';

export const paginationSelectors = (contextId: string) => {
    const paginationState = createFeatureSelector<PaginationState>(defaultStoreKey);
    const contextState = createSelector(
        paginationState,
        s => s.contexts[contextId],
    );

    const contextSelector = <A>(f: (s: PaginationContextState) => A) =>
        createSelector(contextState, f);

    return {
        currentPageIds: contextSelector(selectCurrentPageIds),
        nextPageLoaded: contextSelector(selectNextPageLoaded),
        nextPageLoading: contextSelector(selectNextPageLoading),
        loadingNewPage: contextSelector(selectLoadingNewPage),
        pageNumber: contextSelector(selectPageNumber),
    };
}

export const paginationObservables = (store: Store<any>, selectors: ReturnType<typeof paginationSelectors>) => {
    const sel = <A>(selector: Selector<any, A>) => store.pipe(select(selector));

    return {
        currentPageIds: sel(selectors.currentPageIds),
        nextPageLoaded: sel(selectors.nextPageLoaded),
        nextPageLoading: sel(selectNextPageLoading),
        loadingNewPage: sel(selectors.loadingNewPage),
        pageNumber: sel(selectors.pageNumber),
    }
}

// export const selectCurrentPageIds = ({
//     pages,
//     currentPage,
//   }: PaginationContextState): EntityId[] => (pages ? pages[currentPage] : null);
  
//   export const selectNextPageLoaded = ({
//     pages,
//     currentPage,
//   }: PaginationContextState): boolean => !!pages[currentPage + 1];
  
//   export const selectNextPageLoading = ({
//     pages,
//     currentPage,
//     loadingNewPage,
//   }: PaginationContextState): boolean =>
//     !pages[currentPage + 1] && loadingNewPage;
  
//   export const selectLoadingNewPage = ({
//     loadingNewPage,
//   }: PaginationContextState): boolean => loadingNewPage;
  
//   export const selectPageNumber = ({
//     currentPage,
//   }: PaginationContextState): number => (currentPage >= 0 ? currentPage : null);
  