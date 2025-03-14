import { TestBed } from '@angular/core/testing';

import { EpotpisCryptoService } from './epotpis-crypto.service';

describe('EpotpisCryptoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EpotpisCryptoService = TestBed.get(EpotpisCryptoService);
    expect(service).toBeTruthy();
  });
});
