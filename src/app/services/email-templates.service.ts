import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSessionService } from '../core-module/user-session.service';
import { RestDataSource } from '../shared/rest.datasource';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplatesService {

  constructor(        
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) { 
   
    }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    console.log("EmailTemplatesService - resolve");
    return this.restDataSource.listEmailTemplates();

}
  
}
