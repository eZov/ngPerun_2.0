import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestDataSource } from "./rest.datasource";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UserSessionService } from '../core-services/user-session.service';


@Injectable({
    providedIn: 'root'
  })
export class EmployeeDataService implements Resolve<any>{


    constructor(private restDataSource: RestDataSource,
        public usersession: UserSessionService) {

    }


    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let _empid = route.params["empid"] != undefined ? route.params["empid"] : this.usersession.empId;
        return this.restDataSource.getEmployeeRec(_empid);

    }

}
