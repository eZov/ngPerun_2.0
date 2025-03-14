import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestDataSource } from "./rest.datasource";
import { Resolve } from '@angular/router';


@Injectable()
export class EmployeeRecService implements Resolve<any>{


  constructor(private restDataSource: RestDataSource) {

     }
    

    resolve(): Observable<any> {
        //console.log("EmployeeRecService...");
      return this.restDataSource.getEmployeesRec("S");

  }

}
