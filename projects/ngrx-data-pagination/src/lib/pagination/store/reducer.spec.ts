import {
  GetNextPage,
  GetNextPageSuccess,
  NextPage,
  PrevPage,
  ResetPaginationState,
} from './actions';
import { paginationContextReducer } from './reducer';
import { defaultPaginationContextState, PaginationContextState } from './state';

describe('paginationContextReducer', () => {
  it('ResetPaginationState', () => {
    const state: PaginationContextState = {
      ...defaultPaginationContextState,
      loadingNewPage: true,
    };

    const newState = paginationContextReducer(
      state,
      new ResetPaginationState('a context id'),
    );

    expect(newState).toEqual(defaultPaginationContextState);
  });

  it('GetNextPage', () => {
    const newState = paginationContextReducer(
      defaultPaginationContextState,
      new GetNextPage('a context id'),
    );

    expect(newState).toEqual({
      ...defaultPaginationContextState,
      loadingNewPage: true,
    });
  });

  it('GetNextPageSuccess', () => {
    const state = paginationContextReducer(
      defaultPaginationContextState,
      new GetNextPage('a context id'),
    );

    const action = new GetNextPageSuccess('a context id', [0, 1, 2], false);

    const newState = paginationContextReducer(state, action);

    expect(newState).toEqual({
      ...defaultPaginationContextState,
      pages: [[0, 1, 2]],
      currentPage: 0,
    });
  });

  it('PrevPage', () => {
    const state: PaginationContextState = {
      ...defaultPaginationContextState,
      currentPage: 2,
    };

    const newState = paginationContextReducer(
      state,
      new PrevPage('a context id'),
    );

    expect(newState).toEqual({
      ...defaultPaginationContextState,
      currentPage: 1,
    });
  });

  it('NextPage', () => {
    const state: PaginationContextState = {
      ...defaultPaginationContextState,
      currentPage: 2,
    };

    const newState = paginationContextReducer(
      state,
      new NextPage('a context id'),
    );

    expect(newState).toEqual({
      ...defaultPaginationContextState,
      currentPage: 3,
    });
  });
});
