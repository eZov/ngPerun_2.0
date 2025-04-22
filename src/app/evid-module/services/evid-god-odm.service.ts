import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of, Subject, switchMap } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../../shared/rest.datasource";
import { UserSessionService } from '../../core-services/user-session.service';
import { EvidGodOdm } from '../../model/evid-gododm.model';
import { HttpCoreService } from "../../core-services/http-core.service";
import { LoaderService } from "../../core-services/loader.service";
import { EvidDnevnikService } from "./evid-dnevnik.service";


@Injectable({
  providedIn: 'root'
})
export class EvidGodOdmService {

  public godOdm!: EvidGodOdm;
  private _goYCurrIsk: number = 0;
  private _goYPrevIsk: number = 0;

    private godOdmObs = new Subject<EvidGodOdm>();

  constructor(
    public usersession: UserSessionService,
    private loaderService: LoaderService,
    private httpCoreService: HttpCoreService,
    private evidDnevnikService: EvidDnevnikService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let _dt = new Date();

    let _empid = route.params["empid"] != undefined ? route.params["empid"] : this.usersession.user.empId;
    let _YYYY: number = route.params["yyyy"] != undefined ? route.params["yyyy"] : _dt.getFullYear();


    let _sptype: string = "evidgododm";

    return this.httpCoreService.getData<EvidGodOdm[]>(`${this.httpCoreService.baseUrl}${_sptype}?vrsta=ins&EmployeeID=${_empid}&yyyy=${_YYYY}`).pipe(
      switchMap((value: EvidGodOdm[]) => {

        return of(value);
      }
      )
    )
  }

  setGodOdm(value: EvidGodOdm) {
    this.godOdm = value;
    this._goYPrevIsk = this.godOdm.yprev_isk || 0;
    this._goYCurrIsk = this.godOdm.ycurr_isk || 0;

    if (this.evidDnevnikService._eDnevnikDataClone != undefined && this.evidDnevnikService._evidPodnesen == false) {
      if (this.godOdm != undefined) {
        if (this.godOdm.yprev_isk != undefined) {
          this.godOdm.yprev_isk += this.evidDnevnikService._eDnevnikDataClone.filter((el) =>
            (el.sifra_placanja || '').startsWith("GO-" + (this.godOdm.ycurr || 0 - 1))
          ).length;
        }
        if (this.godOdm.ycurr_isk != undefined) {
          this.godOdm.ycurr_isk += this.evidDnevnikService._eDnevnikDataClone.filter((el) =>
            (el.sifra_placanja || '').startsWith("GO-" + this.godOdm.ycurr)
          ).length;
        }
      }

      this.godOdmObs.next(this.godOdm);
    }
  }

  getGodOdm(): Observable<EvidGodOdm> {
    return this.godOdmObs.asObservable();
  }

  getGoStatus(_empID: number, _YYYY: number) {
    let _sptype: string = "EvidGodOdm";

    this.httpCoreService.getData<EvidGodOdm>(`${this.httpCoreService.baseUrl}${_sptype}?vrsta=ins&EmployeeID=${_empID}&yyyy=${_YYYY}`).subscribe({
      next: (value: EvidGodOdm) => {
        this.setGodOdm(value);

        this.loaderService.display(false);
      },
      error: (err) => {
        console.error("Error loading GO data", err);
        this.loaderService.display(false);
      }
    });
  }
}
