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
export { PaginationFactory } from './lib/pagination/store-interfaces/ngrx/pagination-factory.service';
export { PaginationModule } from './lib/pagination/store-interfaces/ngrx/pagination.module';
export { defaultStoreKey as NGRX_DATA_PAGINATION_STORE_KEY } from './lib/pagination/store-interfaces/ngrx/default-store-key';
