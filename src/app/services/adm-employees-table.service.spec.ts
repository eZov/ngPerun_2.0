import { TestBed } from '@angular/core/testing';

import { AdmEmployeesTableService } from './adm-employees-table.service';

describe('AdmEmployeesTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmEmployeesTableService = TestBed.get(AdmEmployeesTableService);
    expect(service).toBeTruthy();
  });
});
