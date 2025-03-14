import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";
import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../core-module/user-session.service';


@Injectable({
  providedIn: 'root'
})
export class AdmEmployeesRoleService implements Resolve<any> {



  constructor(        
      public restDataSource: RestDataSource,
      public usersession: UserSessionService) { 
     
          console.log("admEmployeesTable.construct" );

      }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

      return this.restDataSource.listAdmEmployeesRoles('byorgpg')

  }
}