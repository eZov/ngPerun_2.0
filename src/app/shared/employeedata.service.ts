import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UserSessionService } from '../core-services/user-session.service';
import { HttpCoreService } from '../core-services/http-core.service';
import { EmployeeRec } from '../model/employeerec.model';


@Injectable({
    providedIn: 'root'
})
export class EmployeeDataService implements Resolve<any> {


    constructor(
        public usersession: UserSessionService,
        private httpCoreService: HttpCoreService
    ) {

    }


    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let _empId = route.params["empid"] != undefined ? route.params["empid"] : this.usersession.empId;

        let _sptype: string = "employee";

        return this.httpCoreService.getData<EmployeeRec>(`${this.httpCoreService.baseUrl}${_sptype}?id=${_empId}&status=X`).pipe(
            switchMap((value: EmployeeRec) => {

                return of(value);
            }
            )
        )
    }


}
