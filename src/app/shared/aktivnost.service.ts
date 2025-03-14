import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestDataSource } from "./rest.datasource";
import { Resolve } from '@angular/router';
import { shareReplay } from 'rxjs/operators';
import { Aktivnost } from '../model/aktivnost.model';


@Injectable()
export class AktivnostService implements Resolve<any>{



    constructor(private restDataSource: RestDataSource) {

    }


    resolve(): Observable<any> {

        return this.restDataSource.getAktivnost();

    }



}
