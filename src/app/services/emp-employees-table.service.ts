import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RestDataSource } from '../shared/rest.datasource';
import { UserSessionService } from '../core-services/user-session.service';

@Injectable({
  providedIn: 'root'
})
export class EmpEmployeesTableService {

  constructor(        
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) { 
   
        console.log("empEmployeesTable.construct" );

    }
    
    resolve(route: ActivatedRouteSnapshot): Observable<any> {

      return this.restDataSource.getEmployeesRecByRole('byorgpg')

  }    
}
