import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of, Subject, switchMap } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from "../core-services/user-session.service";
import { HttpCoreService } from "../core-services/http-core.service";
import { OrgJed } from "../model/orgjed.model";


@Injectable({
  providedIn: 'root'
})
export class OrgListService {

  private orgList = new Subject<OrgJed[]>();
  public orgListObs = this.orgList.asObservable();

  constructor(
    private httpCoreService: HttpCoreService,
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) {

    //console.log("orgListService.construct" );

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    let _sptype: string = "getorganizacijalist";
    let _org: string = "all";

    return this.httpCoreService.getData<OrgJed[]>(`${this.httpCoreService.baseUrl}${_sptype}?list=${_org}`).pipe(
      switchMap((value: OrgJed[]) => {

        return of(value);
      }
      )
    )

  }

  getOrgList(): void {

    let _sptype: string = "getorganizacijalist";
    let _org: string = "all";

    this.httpCoreService.getData<OrgJed[]>(`${this.httpCoreService.baseUrl}${_sptype}?list=${_org}`).subscribe({
      next: (value: OrgJed[]) => {
        this.orgList.next(value);
      },
      error: (err: any) => {
        console.log(err);
      }
    })

  }

}
