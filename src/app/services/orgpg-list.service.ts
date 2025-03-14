import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from './user-session.service';


@Injectable({
  providedIn: 'root'
})
export class OrgPGListService {

  constructor(        
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) { 
   
        //console.log("orgListService.construct" );

    }

resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return this.restDataSource.listOrgJed("pg");

}

}
