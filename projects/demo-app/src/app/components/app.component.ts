import { Component, OnInit } from '@angular/core';
import { NgrxDataPagination } from 'projects/ngrx-data-pagination/src/public-api';
import { Hero } from '../models/hero';
import { HeroPaginationFactory } from '../services/hero-pagination-factory.service';

type HeroPaginationState = number;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  pagination: NgrxDataPagination<Hero, HeroPaginationState>;
  data$: any;

  constructor(private heroPaginationFactory: HeroPaginationFactory) {}

  ngOnInit() {
    this.pagination = this.heroPaginationFactory.createPagination();
    this.data$ = this.pagination.currentPage$;
  }

  nextPage() {
    this.pagination.nextPage();
  }

  prevPage() {
    this.pagination.prevPage();
  }
}
