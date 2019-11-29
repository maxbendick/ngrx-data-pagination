import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { AnyEntity } from '../../entity';
import { ObservablePaginationFunction } from '../../iterator/pagination-function';
import { defaultStoreKey } from './default-store-key';
import { Pagination } from './pagination';

export interface PaginationFactoryArgs<
  Entity extends AnyEntity,
  NextPageState
> {
  contextId?: string;
  paginationFunction: ObservablePaginationFunction<Entity, NextPageState>;
  entityService: EntityCollectionServiceBase<Entity, any>;
  addToCache?: boolean;
}

@Injectable()
export class PaginationFactory {
  private counter = 0;

  constructor(private store: Store<any>) {}

  create<Entity extends AnyEntity, NextPageState>({
    entityService,
    paginationFunction,
    addToCache = true,
    contextId = `${entityService.entityName}-${this.counter++}`,
  }: PaginationFactoryArgs<Entity, NextPageState>): Pagination<
    Entity,
    NextPageState
  > {
    return new Pagination(
      contextId,
      paginationFunction,
      entityService,
      this.store,
      defaultStoreKey,
      addToCache,
    );
  }
}
