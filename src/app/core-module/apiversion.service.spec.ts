import { TestBed } from '@angular/core/testing';

import { APIversionService } from './apiversion.service';

describe('APIversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: APIversionService = TestBed.get(APIversionService);
    expect(service).toBeTruthy();
  });
});
