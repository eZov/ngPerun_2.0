import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of, switchMap } from "rxjs";

import { RestDataSource } from "../../shared/rest.datasource";
import { UserSessionService } from '../../core-services/user-session.service';
import { LoaderService } from "../../core-services/loader.service";
import { HttpCoreService } from "../../core-services/http-core.service";
import { EvidDnStatus } from "../../model/evid-dnstatus.model";


@Injectable({
  providedIn: 'root'
})
export class EvidDnStatusService {

  constructor(
    public restDataSource: RestDataSource,
    public userSessionService: UserSessionService,
    private loaderService: LoaderService,
    private httpCoreService: HttpCoreService) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let _dt = this.userSessionService.firstDate;
    //_dt.setDate(_dt.getDate() - 6);

    let _MM: number = _dt.getMonth() + 1;
    let _YYYY: number = _dt.getFullYear();

    //return this.restDataSource.getEvidDnStatus( _MM, _YYYY);

    let _sptype: string = "eviddnstatusbyorgrole";

    return this.httpCoreService.getData<EvidDnStatus[]>(`${this.httpCoreService.baseUrl}${_sptype}?list=byorgpg&mm=${_MM}&yyyy=${_YYYY}`).pipe(
      switchMap((value: EvidDnStatus[]) => {

        return of(value);
      }
      )
    )
  }

}
