import { Observable } from 'rxjs';

export type PaginationFunctionCurried<Entity, State, QueryOptions> = (
  queryOptions: QueryOptions,
) => (
  prevState?: State,
) => Observable<{
  nextState: State;
  data: Entity[];
}>;

export interface Page<Entity, State> {
  state: State;
  data: Entity[];
  done: boolean;
}

export type PaginationFunction<Entity, State = any> = (
  prevState?: State,
) => Promise<Page<Entity, State>>;

export type ObservablePaginationFunction<Entity, State> = (
  prevState?: State,
) => Observable<Page<Entity, State>>;

export const observableToPromisePaginationFunction = <Entity, State>(
  observableFn: ObservablePaginationFunction<Entity, State>,
): PaginationFunction<Entity, State> => (prevState?: State) =>
  observableFn(prevState).toPromise();
