/*
 * Public API Surface of ngrx-data-pagination
 */

export * from './lib/ngrx-data-pagination.module';
export * from './lib/ngrx-data-pagination.service';
export { NgrxDataPaginationContext } from './lib/pagination/store-interfaces/ngrx/ngrx-pagination-context';
export {
  StorePaginationContext,
} from './lib/pagination/store-interfaces/store-pagination-context';
export { paginationReducer } from './lib/pagination/store/reducer';
export { ObservablePaginationFunction } from './lib/pagination/iterator/pagination-function';
export * from './lib/pagination/store/selectors';
