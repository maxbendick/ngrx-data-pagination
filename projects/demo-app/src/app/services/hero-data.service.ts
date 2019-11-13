import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable, throwError } from 'rxjs';
import { Hero } from '../models/hero';

export const exampleHeroes: Hero[][] = [
  [{ id: '1', name: 'a' }, { id: '2', name: 'b' }, { id: '3', name: 'c' }],
  [{ id: '4', name: 'd' }, { id: '5', name: 'e' }],
];

@Injectable()
export class HeroDataService extends DefaultDataService<Hero> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Account', http, httpUrlGenerator);
  }

  /** Gets all the Heros for the current user */
  getAll(): Observable<Hero[]> {
    return this.notImplemented();
  }

  getById(): Observable<Hero> {
    return this.notImplemented();
  }

  getWithQuery(q: { pageNumber: string }): Observable<Hero[]> {
    return this.notImplemented();
    // const pageNumber = parseInt(q.pageNumber, 10);
    // return of(heroes[pageNumber]);
  }

  add(entity: Hero) {
    return this.notImplemented();
  }

  delete(id: any) {
    return this.notImplemented();
  }

  update(update: Update<Hero>) {
    return this.notImplemented();
  }

  private notImplemented() {
    return throwError('not implemented');
  }
}
