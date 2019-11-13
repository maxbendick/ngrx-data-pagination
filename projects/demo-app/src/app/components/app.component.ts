import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  NgrxDataPaginationContext,
  PaginationFunction,
} from 'projects/ngrx-data-pagination/src/public-api';
import { Observable, of } from 'rxjs';
import { Hero } from '../models/hero';
import { HeroService } from '../services/hero.service';

interface HeroPaginationState {
  pageNumber: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'demo-app';
  pageNum$: Observable<number> = of();
  page$: Observable<Hero[]> = of();
  loadingNextPage$: Observable<boolean> = of();
  loadingCurrentPage$: Observable<boolean> = of();
  paginationContext: NgrxDataPaginationContext<Hero, HeroPaginationState>;

  constructor(private heroService: HeroService, private store: Store<any>) {}

  ngOnInit() {
    console.log(this.heroService);

    const paginationFunction: PaginationFunction<
      Hero,
      HeroPaginationState
    > = state =>
      Promise.resolve({
        state: null,
        data: [],
        done: false,
      });

    this.paginationContext = new NgrxDataPaginationContext<
      Hero,
      HeroPaginationState
    >(
      'hero-context',
      paginationFunction,
      this.heroService as any,
      this.store,
      'ngrxDataPagination',
    );
  }

  nextPage() {
    this.paginationContext.nextPage();
  }

  prevPage() {
    this.paginationContext.prevPage();
  }
}
