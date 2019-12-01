import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hero } from '../models/hero';
import {
  exampleHeroes,
  heroPageSize as exampleHeroPageSize,
} from './example-heroes';

export const heroPageSize = exampleHeroPageSize;

@Injectable({ providedIn: 'root' })
export class HeroPagesService {
  getPage(pageNumber: number): Observable<Hero[]> {
    return of(exampleHeroes[pageNumber]).pipe(delay(1000));
  }
}
