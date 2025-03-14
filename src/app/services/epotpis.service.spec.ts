import { TestBed } from '@angular/core/testing';

import { EpotpisService } from './epotpis.service';

describe('EpotpisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EpotpisService = TestBed.get(EpotpisService);
    expect(service).toBeTruthy();
  });
});
