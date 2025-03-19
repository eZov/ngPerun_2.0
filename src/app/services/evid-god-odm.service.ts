import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../core-services/user-session.service';
import { EvidGodOdm } from '../model/evid-gododm.model';


@Injectable({
  providedIn: 'root'
})
export class EvidGodOdmService {





  constructor(
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let _dt = new Date();
      //let _YYYY: number = _dt.getFullYear();

      let _empid =  route.params["empid"] != undefined ?  route.params["empid"] :this.usersession.empId;
      let _YYYY: number = route.params["yyyy"]!= undefined ? route.params["yyyy"] :_dt.getFullYear(); 

      return this.restDataSource.getEvidGodOdm(_empid, _YYYY);

  }

}
