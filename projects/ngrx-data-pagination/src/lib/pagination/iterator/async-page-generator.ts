import { Page, PaginationFunction } from './pagination-function';

// export type AsyncPageGenerator<Entity> = AsyncGenerator<Entity[], Entity[], any>;

export async function* asyncPageGenerator<Entity, State>(
  paginationFunction: PaginationFunction<Entity, State>,
) { // : AsyncGenerator<Entity[], Entity[], any>
  let page: Page<Entity, State> = { data: undefined, state: undefined, done: false };

  while (true) {
    page = await paginationFunction(page.state);
    if (page.done) {
      return page.data;
    }
    yield page.data;
  }
}

// export const examplePaginationFunction: PaginationFunction<number, number> = state =>
//   Promise.resolve({ data: [state], state: state + 1, done: false, });

// export const exampleAsyncPageGenerator = asyncPageGenerator(examplePaginationFunction);

// const f = async () => {
//   for await (const page of exampleAsyncPageGenerator) {
//     console.log('page', page);
//   }
// };
