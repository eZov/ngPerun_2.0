import { TestBed } from '@angular/core/testing';

import { EmpEmployeesTableService } from './emp-employees-table.service';

describe('EmpEmployeesTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmpEmployeesTableService = TestBed.get(EmpEmployeesTableService);
    expect(service).toBeTruthy();
  });
});
