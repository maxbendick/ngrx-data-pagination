import { EntityCollectionServiceBase } from '@ngrx/data';
import { BehaviorSubject, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PageIterator } from './page-iterator';
import { PaginationFunction } from './pagination-function';

export class PaginationContext<Entity, PaginationState> {
  private pageIterator: PageIterator<Entity>;
  private pagesSubject = new BehaviorSubject<Entity[][]>([]);

  constructor(
    private entityService: EntityCollectionServiceBase<Entity>,
    paginationFunction: PaginationFunction<Entity, PaginationState>,
  ) {
    this.pageIterator = new PageIterator(paginationFunction);
  }

  // TODO cancellation, hotness, error semantics
  getNextPage() {
    return from(this.pageIterator.getNextPage()).pipe(
      tap(page => {
        this.entityService.addManyToCache(page);
        this.pagesSubject.next([...this.pagesSubject.value, page]);
      }),
    );
  }

  get pages$() {
    return this.pagesSubject.asObservable();
  }
}
