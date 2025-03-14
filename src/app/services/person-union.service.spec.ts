import { TestBed } from '@angular/core/testing';

import { PersonUnionService } from './person-union.service';

describe('PersonUnionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonUnionService = TestBed.get(PersonUnionService);
    expect(service).toBeTruthy();
  });
});
