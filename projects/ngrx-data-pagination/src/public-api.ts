/*
 * Public API Surface of ngrx-data-pagination
 */

// export * from './lib/ngrx-data-pagination.module';
// export * from './lib/ngrx-data-pagination.service';
// export * from './lib/pagination/store/selectors';
export {
  ObservablePaginationFunction,
  Page,
} from './lib/pagination/iterator/pagination-function';
export {
  NgrxDataPagination,
} from './lib/pagination/store-interfaces/ngrx/ngrx-data-pagination';
export { paginationReducer } from './lib/pagination/store/reducer';
