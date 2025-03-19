import { Injectable } from '@angular/core';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { OrgJed } from '../../model/orgjed.model';
import { HttpCoreService } from '../../core-services/http-core.service';

@Injectable()
export class DataService {

  private dataSubject = new Subject<OrgJed[]>();
  public data = this.dataSubject.asObservable();

  constructor(
    private httpCoreService: HttpCoreService
  ) {
    console.log('DataService constructor');
  }

  getData(): void {
    let _sptype: string = "getorganizacijalist";
    let _org: string = "all";
    console.log('DataService getData');
    this.httpCoreService.getData<OrgJed[]>(`${this.httpCoreService.baseUrl}${_sptype}?list=${_org}`).subscribe({
      next: (value: OrgJed[]) => {
        this.dataSubject.next(value);
      },
      error: (err: any) => {
        console.log(err);
      }
    }
    );
  }

}
