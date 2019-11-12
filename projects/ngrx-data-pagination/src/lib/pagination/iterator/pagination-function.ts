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

export type PaginationFunction<Entity, State> = (
  prevState?: State,
) => Promise<Page<Entity, State>>;
