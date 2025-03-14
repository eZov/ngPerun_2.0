import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../core-module/user-session.service';


@Injectable({
  providedIn: 'root'
})
export class EvidDnStatusService {

  constructor(
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let _dt = this.usersession.firstDate;
    //_dt.setDate(_dt.getDate() - 6);

      let _MM: number = _dt.getMonth() + 1;
      let _YYYY: number = _dt.getFullYear();

      return this.restDataSource.getEvidDnStatus( _MM, _YYYY);
  }

}
