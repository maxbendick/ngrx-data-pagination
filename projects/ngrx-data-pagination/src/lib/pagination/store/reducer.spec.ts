import {
  GetNextPage,
  GetNextPageSuccess,
  PrevPage,
  ResetPaginationState,
  NextPage,
} from './actions';
import { paginationContextReducer } from './reducer';
import { defaultPaginationContextState } from './state';

describe('paginationContextReducer', () => {
  it('ResetPaginationState', () => {
    const state = {
      ...defaultPaginationContextState,
      fetchingNextPage: true,
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
      fetchingNextPage: true,
    });
  });

  it('GetNextPageSuccess', () => {
    const state = paginationContextReducer(
      defaultPaginationContextState,
      new GetNextPage('a context id'),
    );

    const action = new GetNextPageSuccess('a context id', [0, 1, 2]);

    const newState = paginationContextReducer(state, action);

    expect(newState).toEqual({
      ...defaultPaginationContextState,
      pages: [[0, 1, 2]],
      currentPage: 1,
    });
  });

  it('PrevPage', () => {
    const state = {
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
    const state = {
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
