import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of, Subject, switchMap } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { UserSessionService } from '../../core-services/user-session.service';
import { EvidGodOdm } from '../../model/evid-gododm.model';
import { HttpCoreService } from "../../core-services/http-core.service";
import { LoaderService } from "../../core-services/loader.service";
import { EvidDnevnikService } from "./evid-dnevnik.service";
import { EvidDnStatus } from "../../model/evid-dnstatus.model";
import { EvidDnevnik } from "../../model/evid-dnevnik.model";
import { EvidProcesService } from "./evid-proces.service";


@Injectable({
    providedIn: 'root'
})
export class EvidKontrolaService {

    private evidDnStatusData = new Subject<EvidDnStatus[]>();

    constructor(
        public usersession: UserSessionService,
        private loaderService: LoaderService,
        private httpCoreService: HttpCoreService,
        private evidProcesService: EvidProcesService        
    ) {

    }

    getEvidDnStatusData = (): Observable<EvidDnStatus[]> => {
        return this.evidDnStatusData.asObservable();
    };

    setEvidDnStatusData = (_data: EvidDnStatus[]) => {
        this.setGridDataSource(_data);
    };

    private setGridDataSource(_evidDnStatusData: EvidDnStatus[]) {

        let _dummyDataGrid = JSON.stringify(_evidDnStatusData);
        let _dummyParsedDataGrid: EvidDnevnik[] = new Array<EvidDnevnik>();

        _dummyParsedDataGrid = JSON.parse(_dummyDataGrid, (field, value) => {
            let dupValue: string = value;
            if (typeof value === 'string' && /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*){1})([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(value)) {
                let arr = dupValue.split(/[^0-9]/);

                let dt = new Date();
                dt = new Date(Date.UTC(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10),
                    parseInt(arr[3], 10), parseInt(arr[4], 10), parseInt(arr[5], 10)));
                dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());

                return dt;
            } else {
                return value;
            };
        });

        this.evidDnStatusData.next(_dummyParsedDataGrid.map(res => {
            if ((res.vrijeme_od === res.vrijeme_do) && (res.vrijeme_od === "00:00")) {
                res.vrijeme_od = "";
                res.vrijeme_do = "";
            }
            return res;
        }));
    }

    public refreshGrid(_MM: number, _YYYY: number) {

        let _sptype: string = "eviddnstatusbyorgrole";

        this.httpCoreService.getData<EvidDnStatus[]>(`${this.httpCoreService.baseUrl}${_sptype}?list=byorgpg&mm=${_MM}&yyyy=${_YYYY}`).subscribe({
            next: (value: EvidDnStatus[]) => {
                this.setGridDataSource(value);
                this.evidProcesService.setFlags(value);
            },
            error: (err) => {
                console.error("Error loading GO data", err);
                this.loaderService.display(false);
            }
        });
    }

    updEvidDnStatus(_evidDnStatusData: EvidDnStatus[]) {

        let _sptype: string = "eviddnstatuswrite";

        this.httpCoreService.postData<EvidDnStatus[]>(`${this.httpCoreService.baseUrl}${_sptype}?`, _evidDnStatusData).subscribe({
            next: (value: EvidDnStatus[]) => {
                this.setGridDataSource(value);
            },
            error: (err) => {
                console.error("Error loading GO data", err);
                this.loaderService.display(false);
            }
        });
      }
}
