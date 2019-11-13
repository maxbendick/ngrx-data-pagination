import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  NgrxDataPaginationContext,
  ObservablePaginationFunction,
} from 'projects/ngrx-data-pagination/src/public-api';
import { map } from 'rxjs/operators';
import { Hero } from '../models/hero';
import { HeroPagesService } from './hero-pages.service';
import { HeroService } from './hero.service';

type HeroPaginationState = number;

@Injectable({ providedIn: 'root' })
export class HeroPaginationFactory {
  constructor(
    private heroService: HeroService,
    private store: Store<any>,
    private heroPagesService: HeroPagesService,
  ) {}

  createPagination() {
    const paginationFunction: ObservablePaginationFunction<
      Hero,
      HeroPaginationState
    > = state => {
      const pageNumber = state ? state : 0;

      return this.heroPagesService.getPage(pageNumber).pipe(
        map(data => ({
          state: pageNumber + 1,
          data: data ? data : [],
          done: !data || !data.length,
        })),
      );
    };

    return new NgrxDataPaginationContext<Hero, HeroPaginationState>(
      'hero-context',
      paginationFunction,
      this.heroService as any,
      this.store,
      'ngrxDataPagination',
    );
  }
}
