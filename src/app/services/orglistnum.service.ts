import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../core-services/user-session.service';


@Injectable({
  providedIn: 'root'
})
export class OrglistnumService {

  constructor(        
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) { 
   
        console.log("orgListNumService.construct" );

    }

resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return this.restDataSource.listOrgJedNum();

}

}
