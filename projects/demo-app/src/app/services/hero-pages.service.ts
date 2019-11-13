import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hero } from '../models/hero';
import { exampleHeroes } from './example-heroes';

@Injectable({ providedIn: 'root' })
export class HeroPagesService {
  getPage(pageNumber: number): Observable<Hero[]> {
    return of(exampleHeroes[pageNumber]).pipe(delay(1000));
  }
}
