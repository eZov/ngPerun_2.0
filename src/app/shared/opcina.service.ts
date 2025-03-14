import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestDataSource } from "./rest.datasource";
import { Resolve } from '@angular/router';
import { shareReplay } from 'rxjs/operators';


@Injectable()
export class OpcinaService implements Resolve<any>{



    constructor(private restDataSource: RestDataSource) {

    }


    resolve(): Observable<any> {

        return this.restDataSource.getOpcina();

    }



}
