import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Resolve } from '@angular/router';
import { HttpCoreService } from '../core-services/http-core.service';
import { EvidSifra } from '../model/evid-sifra.model';


@Injectable({
    providedIn: 'root'
})
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

/*
Dohvaća boje za tipove evidencije u kalendaru i dnevniku rada:
[
{"itemType":"3","color":"MediumVioletRed","title":"Službeni put","sifra":"SP","sati":0.0},
{"itemType":"4","color":"Gray","title":"Godišnji odmor","sifra":"GO","sati":0.0},
...

*/