import { TestBed } from '@angular/core/testing';

import { OrgListService } from './org-list.service';

describe('OrgListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrgListService = TestBed.get(OrgListService);
    expect(service).toBeTruthy();
  });
});
