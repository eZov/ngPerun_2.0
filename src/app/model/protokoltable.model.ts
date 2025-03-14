import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";
import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../services/user-session.service';
import { Protokol } from './protokol.model';

@Injectable()


export class ProtokolTableModel implements Resolve<any> {



    constructor(        
        public restDataSource: RestDataSource,
        public usersession: UserSessionService) { 
       
            console.log("ProtokolTableModel.construct" );

        }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        return this.restDataSource.getProtokolByYear(2019);
    }



    
}
