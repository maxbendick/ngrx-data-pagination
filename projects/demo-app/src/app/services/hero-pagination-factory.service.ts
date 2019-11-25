import { Injectable } from '@angular/core';
import {
  ObservablePaginationFunction,
  Page,
  PaginationFactory,
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
    private heroPagesService: HeroPagesService,
    private paginationFactory: PaginationFactory,
  ) {}

  createPagination() {
    const paginationFunction: ObservablePaginationFunction<
      Hero,
      HeroPaginationState
    > = state => {
      const pageNumber = state ? state : 0;

      return this.heroPagesService.getPage(pageNumber).pipe(
        map(
          (data): Page<Hero, HeroPaginationState> => ({
            state: pageNumber + 1,
            data: data ? data : [],
            done: !data || !data.length,
          }),
        ),
      );
    };

    return this.paginationFactory.create({
      contextId: 'hero-context',
      entityService: this.heroService as any,
      paginationFunction,
    });
  }
}
