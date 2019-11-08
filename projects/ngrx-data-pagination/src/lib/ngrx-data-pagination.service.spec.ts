import { TestBed } from '@angular/core/testing';

import { NgrxDataPaginationService } from './ngrx-data-pagination.service';

describe('NgrxDataPaginationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgrxDataPaginationService = TestBed.get(NgrxDataPaginationService);
    expect(service).toBeTruthy();
  });
});
