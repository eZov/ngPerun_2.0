import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { RestDataSource } from "./rest.datasource";
import { Resolve } from '@angular/router';
import { HttpCoreService } from '../core-services/http-core.service';
import { EvidSifra } from '../model/evid-sifra.model';


@Injectable()
export class SfrEvidPrisService implements Resolve<any> {



    constructor(
        private httpCoreService: HttpCoreService
    ) {

    }


    resolve(): Observable<any> {
        let _sptype: string = "sfrevidpris";

        return this.httpCoreService.getData<EvidSifra[]>(`${this.httpCoreService.baseUrl}${_sptype}?vrsta=dnevnik`).pipe(
            switchMap((value: EvidSifra[]) => {

                return of(value);
            }
            )
        )
    }



}
