import { Injectable } from '@angular/core';
import {
  ObservablePaginationFunction,
  Pagination,
  PaginationFactory,
} from 'projects/ngrx-data-pagination/src/public-api';
import { map } from 'rxjs/operators';
import { Hero } from '../models/hero';
import { heroPageSize, HeroPagesService } from './hero-pages.service';
import { HeroService } from './hero.service';

type HeroPaginationState = number;

const defaultHeroPaginationState: HeroPaginationState = 0;

@Injectable({ providedIn: 'root' })
export class HeroPaginationFactory {
  constructor(
    private heroService: HeroService,
    private heroPagesService: HeroPagesService,
    private paginationFactory: PaginationFactory,
  ) {}

  createPagination(): Pagination<Hero> {
    const paginationFunction: ObservablePaginationFunction<
      Hero,
      HeroPaginationState
    > = (pageNumber = defaultHeroPaginationState) =>
      this.heroPagesService.getPage(pageNumber).pipe(
        map(heroes => ({
          state: pageNumber + 1,
          data: heroes || [],
          done: !heroes || heroes.length < heroPageSize,
        })),
      );

    return this.paginationFactory.create({
      contextId: 'hero-context',
      entityService: this.heroService,
      paginationFunction,
    });
  }
}
