import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of, switchMap } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../../shared/rest.datasource";
import { UserSessionService } from '../../core-services/user-session.service';
import { EvidGodOdm } from '../../model/evid-gododm.model';
import { HttpCoreService } from "../../core-services/http-core.service";


@Injectable({
  providedIn: 'root'
})
export class EvidGodOdmService {





  constructor(
    public restDataSource: RestDataSource,
    public usersession: UserSessionService,
    private httpCoreService: HttpCoreService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let _dt = new Date();
    //let _YYYY: number = _dt.getFullYear();

    let _empid = route.params["empid"] != undefined ? route.params["empid"] : this.usersession.empId;
    let _YYYY: number = route.params["yyyy"] != undefined ? route.params["yyyy"] : _dt.getFullYear();

    //return this.restDataSource.getEvidGodOdm(_empid, _YYYY);

    let _sptype: string = "evidgododm";

    return this.httpCoreService.getData<EvidGodOdm[]>(`${this.httpCoreService.baseUrl}${_sptype}?vrsta=ins&EmployeeID=${_empid}&yyyy=${_YYYY}`).pipe(
      switchMap((value: EvidGodOdm[]) => {

        return of(value);
      }
      )
    )
  }

}
