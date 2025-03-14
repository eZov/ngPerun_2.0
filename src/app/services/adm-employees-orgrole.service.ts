import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";
import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../core-module/user-session.service';
import { AdmEmployee } from '../model/adm-employees.model';
import { AdmEmployeeOrgrole } from '../model/adm-employee-orgrole.model';

@Injectable({
  providedIn: 'root'
})
export class AdmEmployeesOrgroleService {

  constructor(        
      public restDataSource: RestDataSource,
      public usersession: UserSessionService) { 
     
          console.log("admEmployeesOrgrole.construct" );

      }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

      return this.restDataSource.listAdmEmployeesOrgRoles('byorgpg')

  }

}
