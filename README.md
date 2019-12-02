# :page_with_curl: ngrx-data-pagination

`ngrx-data-pagination` adds pagination to `@ngrx/data`! :tada:

You show `ngrx-data-pagination` how your pagination API works, and the library gives you an easy-to-use, reactive `Pagination` object. It's backed by `@ngrx/store`, so it's totally inspectable and timetravel-able.

## This library is a baby! :baby:

However, it works! Expect breaking changes with each version for now. Better docs, more features, and API consistency are on their way.

An important feature in the works is indexed (as opposed to sequential) pagination. This will let users skip from any page to the Nth page rather than visiting each page in-between. For now, only sequential pagination is available.

## How to use
Install
```
npm i ngrx-data-pagination
```

Add `PaginationModule.forRoot()` to your `AppModule`
```typescript
@NgModule({
  ...
  imports: [
    ...
    PaginationModule.forRoot(),
  ],
})
export class AppModule {}
```

Create a `Pagination` object
```typescript
type HeroPaginationState = number;

@Injectable({ providedIn: 'root' })
export class HeroPaginationFactory {
  constructor(
    private heroService: HeroService, // a normal ngrx/data entity service
    private heroPagesService: HeroPagesService, // for example - it provides a `getPage` method
    private paginationFactory: PaginationFactory, // provided by this library
  ) {}

  createPagination(): Pagination<Hero> {
    const paginationFunction: ObservablePaginationFunction<
      Hero,
      HeroPaginationState
    > = (pageNumber = defaultHeroPaginationState) =>
      this.heroPagesService.getPage(pageNumber).pipe(
        map(heroes => ({
          state: pageNumber + 1, // calculate the next state
          data: heroes || [],
          done: !heroes || heroes.length < heroPageSize, // stop iterating when desired
        })),
      );

    return this.paginationFactory.create({
      entityService: this.heroService,
      paginationFunction,
    });
  }
}
```

Data types to keep in mind
```typescript
interface Page<Entity, State> {
  state: State; // usually a page number or a cursor
  data: Entity[]; // the entities from the response
  done: boolean; // whether this is the last page or not
}

// When called with the previous state (or undefined if the first page),
// returns an observable of the next `Page`
type ObservablePaginationFunction<Entity, State> = 
  (prevState?: State) => Observable<Page<Entity, State>>;
 
```

Usage in a component
```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  pagination: Pagination<Hero>;
  page$: Observable<Hero[]>;

  constructor(private heroPaginationFactory: HeroPaginationFactory) {}

  ngOnInit() {
    this.pagination = this.heroPaginationFactory.createPagination();
    this.page$ = this.pagination.selectors$.page;
    
    // Pagination also exposes `selectors` and `selectors$`, just like @ngrx/data
  }

  nextPage() {
    this.pagination.nextPage();
  }

  prevPage() {
    this.pagination.prevPage();
  }
}
```

Template usage
```html
<div>{{ page$ | async | json }}</div>

<table>
  <tr>
    <td>Page Number</td>
    <td>{{ pagination.selectors$.pageNumber | async | json }}</td>
  </tr>
  <tr>
    <td>Next page loading</td>
    <td>{{ pagination.selectors$.nextPageLoading | async | json }}</td>
  </tr>
  <tr>
    <td>Loading new page</td>
    <td>{{ pagination.selectors$.loadingNewPage | async | json }}</td>
  </tr>
  <tr>
    <td>Done</td>
    <td>{{ pagination.selectors$.done | async | json }}</td>
  </tr>
</table>

<br>

<button (click)="prevPage()">Prev Page</button>
<button (click)="nextPage()">Next Page</button>
```
