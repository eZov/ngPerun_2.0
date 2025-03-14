import { TestBed } from '@angular/core/testing';

import { AdmEmployeesRoleService } from './adm-employees-role.service';

describe('AdmEmployeesRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmEmployeesRoleService = TestBed.get(AdmEmployeesRoleService);
    expect(service).toBeTruthy();
  });
});
