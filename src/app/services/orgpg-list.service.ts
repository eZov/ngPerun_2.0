import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of, switchMap } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../core-services/user-session.service';
import { HttpCoreService } from "../core-services/http-core.service";
import { OrgJed } from "../model/orgjed.model";


@Injectable({
  providedIn: 'root'
})
export class OrgPGListService {

  constructor(
    private httpCoreService: HttpCoreService,
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) {

    //console.log("orgListService.construct" );

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    //return this.restDataSource.listOrgJed("pg");

    let _sptype: string = "getorganizacijalist";
    let _org: string = "pg";

    return this.httpCoreService.getData<OrgJed[]>(`${this.httpCoreService.baseUrl}${_sptype}?list=${_org}`).pipe(
      switchMap((value: OrgJed[]) => {

        return of(value);
      }
      )
    )

  }

}
