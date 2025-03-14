import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestDataSource } from '../shared/rest.datasource';

@Injectable({
  providedIn: 'root'
})
export class PersonUnionService {

  constructor(private restDataSource: RestDataSource) { }

  resolve(): Observable<any> {
    return this.restDataSource.getPersonUnionAll();
  }

  
}
