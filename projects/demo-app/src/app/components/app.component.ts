import { Component, OnInit } from '@angular/core';
import { Pagination } from 'projects/ngrx-data-pagination/src/public-api';
import { Observable } from 'rxjs';
import { Hero } from '../models/hero';
import { HeroPaginationFactory } from '../services/hero-pagination-factory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  pagination: Pagination<Hero>;
  page$: Observable<Hero[]>;

  demoCodeLink =
    'https://github.com/maxbendick/ngrx-data-pagination/tree/master/projects/demo-app';
  libraryCodeLink =
    'https://github.com/maxbendick/ngrx-data-pagination/tree/master/projects/ngrx-data-pagination';

  constructor(private heroPaginationFactory: HeroPaginationFactory) {}

  ngOnInit() {
    this.pagination = this.heroPaginationFactory.createPagination();
    this.page$ = this.pagination.selectors$.page;
  }

  nextPage() {
    this.pagination.nextPage();
  }

  prevPage() {
    this.pagination.prevPage();
  }

  loadAllPages() {
    // Don't recommend because it's uncancellable!
    this.pagination._loadAllPages();
  }
}
