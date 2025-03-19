import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";
import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../core-services/user-session.service';
import { AdmEmployee } from '../model/adm-employees.model';

@Injectable({
  providedIn: 'root'
})
export class AdmEmployeesTableService implements Resolve<any> {


    constructor(        
        public restDataSource: RestDataSource,
        public usersession: UserSessionService) { 
       
            console.log("admEmployeesTable.construct" );

        }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        console.log("admEmployeesTable.service RESOLVE" );
        return this.restDataSource.listAdmEmployees('byorgpg')

    }
}
