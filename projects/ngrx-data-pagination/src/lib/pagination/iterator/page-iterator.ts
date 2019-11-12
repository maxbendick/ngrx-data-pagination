import { asyncPageGenerator } from './async-page-generator';
import { PaginationFunction } from './pagination-function';

export class PageIterator<Entity> {
  private asyncPageGenerator: any; //  AsyncPageGenerator<Entity>;
  public done = false;
  private pending = false;

  constructor(paginationFunction: PaginationFunction<Entity, any>) {
    this.asyncPageGenerator = asyncPageGenerator(paginationFunction);
  }

  async getNextPage(): Promise<Entity[]> {
    if (this.pending) {
      throw new Error('cannot queue pages (yet)');
    }

    if (this.done) {
      throw new Error('This PageIterator is done. Try creating a new one');
    }

    this.pending = true;

    const { value, done } = await this.asyncPageGenerator.next();

    this.pending = false;
    this.done = done;
    return value;
  }

  [Symbol.asyncIterator] = () => this.asyncPageGenerator;
}
