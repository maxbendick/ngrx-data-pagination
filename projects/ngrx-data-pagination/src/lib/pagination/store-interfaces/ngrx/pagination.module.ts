import { NgModule, Optional, SkipSelf, ModuleWithProviders, Inject } from '@angular/core';
import { PaginationFactory } from './pagination-factory.service';
import { StoreModule } from '@ngrx/store';
import { paginationReducer } from '../../store/reducer';
import { defaultStoreKey } from './default-store-key';

const NGRX_DATA_PAGINATION_STORE_KEY = 'NGRX_DATA_PAGINATION_STORE_KEY';


@NgModule({
  declarations: [],
  imports: [StoreModule.forFeature(defaultStoreKey, paginationReducer)],
  exports: [],
  providers: [PaginationFactory]
})
export class PaginationModule {
  constructor(
    @Optional() @SkipSelf() parentModule: PaginationModule,
    @Inject(NGRX_DATA_PAGINATION_STORE_KEY) storeKey: string,
  ) {
    if (parentModule) {
      throw new Error(
        'PaginationModule is already loaded. Import it in the AppModule only');
    }
    if (!storeKey) {
      throw new Error('PaginationModule requires StoreModule.forRoot() to be imported');
    }
  }

  /**
   * `storeKey` doesn't actually work yet`
   */
  static forRoot(storeKey: string = defaultStoreKey): ModuleWithProviders {
    return {
      ngModule: PaginationModule,
      providers: [
        {
          provide: NGRX_DATA_PAGINATION_STORE_KEY,
          useValue: defaultStoreKey,
        },
      ]
    };
  }
}