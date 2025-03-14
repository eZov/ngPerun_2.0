import { TestBed } from '@angular/core/testing';

import { AdmEmployeesOrgroleService } from './adm-employees-orgrole.service';

describe('AdmEmployeesOrgroleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmEmployeesOrgroleService = TestBed.get(AdmEmployeesOrgroleService);
    expect(service).toBeTruthy();
  });
});
