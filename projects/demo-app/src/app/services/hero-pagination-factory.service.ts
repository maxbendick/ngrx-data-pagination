import { Injectable } from '@angular/core';
import {
  ObservablePaginationFunction,
  Page,
  Pagination,
  PaginationFactory,
} from 'projects/ngrx-data-pagination/src/public-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hero } from '../models/hero';
import { HeroPagesService } from './hero-pages.service';
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
    > = (
      pageNumber: HeroPaginationState = defaultHeroPaginationState,
    ): Observable<Page<Hero, HeroPaginationState>> => {
      return this.heroPagesService.getPage(pageNumber).pipe(
        map(
          (heroes: Hero[]): Page<Hero, HeroPaginationState> => ({
            state: pageNumber + 1,
            data: heroes || [],
            done: !heroes || !heroes.length,
          }),
        ),
      );
    };

    return this.paginationFactory.create({
      contextId: 'hero-context',
      entityService: this.heroService,
      paginationFunction,
    });
  }
}
