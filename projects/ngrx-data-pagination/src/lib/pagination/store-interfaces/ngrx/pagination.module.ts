import {
  Inject,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { paginationReducer } from '../../store/reducer';
import { defaultStoreKey } from './default-store-key';
import { PaginationFactory } from './pagination-factory.service';

const NGRX_DATA_PAGINATION_STORE_KEY = 'NGRX_DATA_PAGINATION_STORE_KEY';

@NgModule({
  declarations: [],
  imports: [StoreModule.forFeature(defaultStoreKey, paginationReducer)],
  exports: [],
  providers: [PaginationFactory],
})
export class PaginationModule {
  constructor(
    @Optional() @SkipSelf() parentModule: PaginationModule,
    @Optional() @Inject(NGRX_DATA_PAGINATION_STORE_KEY) storeKey: string,
  ) {
    if (parentModule) {
      throw new Error(
        'PaginationModule is already loaded. Import it in the root module (usually the AppModule) only',
      );
    }
    if (!storeKey) {
      throw new Error(
        'ngrx-data-pagination requires PaginationModule.forRoot() to be imported',
      );
    }
  }

  /**
   * `storeKey` doesn't actually work yet`
   */
  static forRoot(): ModuleWithProviders<PaginationModule> {
    return {
      ngModule: PaginationModule,
      providers: [
        {
          provide: NGRX_DATA_PAGINATION_STORE_KEY,
          useValue: defaultStoreKey,
        },
      ],
    };
  }
}
