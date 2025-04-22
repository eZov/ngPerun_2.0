import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of, switchMap } from "rxjs";

import { UserSessionService } from '../../core-services/user-session.service';
import { EvidGodOdm } from '../../model/evid-gododm.model';
import { HttpCoreService } from "../../core-services/http-core.service";
import { EmployeeRec } from "../../model/employeerec.model";


@Injectable({
  providedIn: 'root'
})
export class EvidEmployeeService {


  constructor(
    public usersession: UserSessionService,
    private httpCoreService: HttpCoreService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    let _empid = route.params["empid"] != undefined ? route.params["empid"] : this.usersession.user.empId;

    let _sptype: string = "getemployee";

    return this.httpCoreService.getData<EmployeeRec>(`${this.httpCoreService.baseUrl}${_sptype}?EmployeeID=${_empid}`).pipe(
      switchMap((value: EmployeeRec) => {

        return of(value);
      }
      )
    )
  }

}
