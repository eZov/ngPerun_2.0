import { Injectable } from '@angular/core';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { EmployeeRec } from '../../model/employeerec.model';
import { HttpCoreService } from '../../core-services/http-core.service';
import { AdmUserRoles } from '../../model/adm-user-roles.model';
import { AdmEmployee } from '../../model/adm-employees.model';

@Injectable()
export class EmployeesRolesService {

    private dataRoles = new Subject<{ Id: string, Role: string }[]>();
    public dataRoles$ = this.dataRoles.asObservable();

    private empRoles = new Subject<string[]>();
    public empRoles$ = this.empRoles.asObservable();

    public rolesData: { Id: string, Role: string }[] = [
        { Id: 'rukovodilac', Role: 'rukovodilac' },
        { Id: 'uposlenik', Role: 'uposlenik' },
        { Id: 'administrator', Role: 'administrator' },
        { Id: 'blagajna', Role: 'blagajna' },
        { Id: 'likvidatura', Role: 'likvidatura' },
        { Id: 'evidencija', Role: 'evidencija' },
        { Id: 'ljudskiresursi', Role: 'ljudskiresursi' },
        { Id: 'place', Role: 'place' },
        { Id: 'producent', Role: 'producent' },
        { Id: 'uprava', Role: 'uprava' }
    ];

    constructor(
        private httpCoreService: HttpCoreService
    ) {
        console.log('DataService constructor');
    }


    listUserEmployeeBySifra(_sifra: string): Observable<AdmUserRoles[]> {

        let _sptype: string = "GetEmployeeRolesList";
        return this.httpCoreService.getData<AdmUserRoles[]>(`${this.httpCoreService.baseUrl}${_sptype}?list=byorgpg`).pipe(
            switchMap((value: AdmUserRoles[]) => {
                return of(value);
            }
            )
        )
    }

    setData() {

        this.dataRoles.next(this.rolesData); // roles for the employee
    }

    setEmpRoles(_rolesCsv: string) {
        console.log('emp-roles.service _rolesCsv: ', _rolesCsv);

        this.empRoles.next(_rolesCsv.split(",")); // Example roles for the employee
    }

}
