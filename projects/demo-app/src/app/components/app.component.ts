import { Component, OnInit } from '@angular/core';
import { NgrxDataPaginationContext } from 'projects/ngrx-data-pagination/src/public-api';
import { Hero } from '../models/hero';
import { HeroPaginationFactory } from '../services/hero-pagination-factory.service';

type HeroPaginationState = number;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  pagination: NgrxDataPaginationContext<Hero, HeroPaginationState>;

  constructor(private heroPaginationFactory: HeroPaginationFactory) {}

  ngOnInit() {
    this.pagination = this.heroPaginationFactory.createPagination();
  }

  nextPage() {
    this.pagination.nextPage();
  }

  prevPage() {
    this.pagination.prevPage();
  }
}
