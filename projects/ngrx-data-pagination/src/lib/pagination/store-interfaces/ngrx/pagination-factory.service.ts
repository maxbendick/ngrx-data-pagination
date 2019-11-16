import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { NgrxDataPagination } from './ngrx-data-pagination';
import { AnyEntity } from '../../entity';
import { ObservablePaginationFunction } from '../../iterator/pagination-function';
import { EntityCollectionServiceBase } from '@ngrx/data';
import { defaultStoreKey } from './default-store-key';

export interface PaginationFactoryArgs<Entity extends AnyEntity, NextPageState> {
    contextId?: string,
    pagiationFunction: ObservablePaginationFunction<Entity, NextPageState>,
    entityService: EntityCollectionServiceBase<Entity, any>,
}

@Injectable()
export class PaginationFactory {
    private counter = 0;

    constructor(private store: Store<any>) { }

    create<Entity extends AnyEntity, NextPageState>({
        contextId,
        entityService,
        pagiationFunction,
    }: PaginationFactoryArgs<Entity, NextPageState>): NgrxDataPagination<Entity, NextPageState> {
        const safeContextId = contextId || `${entityService.entityName}-${this.counter++}`
        
        return new NgrxDataPagination(
            safeContextId,
            pagiationFunction,
            entityService,
            this.store,
            defaultStoreKey,
        );
    }
}
