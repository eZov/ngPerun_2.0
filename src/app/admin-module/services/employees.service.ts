import { Injectable } from '@angular/core';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { HttpCoreService } from '../../core-services/http-core.service';
import { EmployeeRec } from '../../model/employeerec.model';

@Injectable()
export class EmployeesService {

  private dataSubject = new Subject<EmployeeRec[]>();
  public data = this.dataSubject.asObservable();

  constructor(
    private httpCoreService: HttpCoreService
  ) {
    console.log('DataService constructor');
  }

  getData(_org: string): void {
    let _sptype: string = "listemployee";

    console.log('EmployeesService getData');
    this.httpCoreService.getData<EmployeeRec[]>(`${this.httpCoreService.baseUrl}${_sptype}?org=${_org}`).subscribe({
      next: (value: EmployeeRec[]) => {
        this.dataSubject.next(value);
      },
      error: (err: any) => {
        console.log(err);
      }
    }
    );
  }

}
