import { Injectable } from '@angular/core';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { EmployeeRec } from '../../model/employeerec.model';
import { HttpCoreService } from '../../core-services/http-core.service';

@Injectable()
export class EmployeeService {

  private dataSubject = new Subject<EmployeeRec>();
  public data = this.dataSubject.asObservable();

  constructor(
    private httpCoreService: HttpCoreService
  ) {
    console.log('DataService constructor');
  }

  setEmployee(_employeeRec: EmployeeRec) {
    this.dataSubject.next(_employeeRec);
  }

  saveEmployee(employee: EmployeeRec): Observable<any> {

    let _upd: string = "updemployee";
    let _ins: string = "insemployee";

    switch (employee.EmployeeID) {
      case -1:
        let _employeeIns = {
          "EmployeeNumber": employee.EmployeeNumber,
          "Title": "",
          "JMB": "1234567890123",
          "FirstName": employee.FirstName,
          "MiddleName": "",
          "LastName": employee.LastName,
          "BrSocOsig": "9999999",
          "Opc_Stanovanja": "BH0000",
          "Djeca": 0,
          "RadnoMjesto": 0,
          "PostalCode": "",
          "DepartmentID": 1,
          "OfficeLocation": "",
          "Dat_Rodjenja": "0000-00-00",
          "Dat_Zaposl": "1993-12-02",
          "Dat_Odlaska": "0001-01-01",
          "Aktivan": true,
          "Razlog_Odlaska": "...",
          "DepartmentUP": employee.DepartmentUP,
          "Pol": "M",
          "ImeRoditelja": "",
          "Broj_LK": "x",
          "Mjesto_LK": "",
          "Opcina_LK": "",
          "Drzavljanstvo": "",
          "Narod": "",
          "BracnoStanje": "",
          "emp_hm_telephone": "+12  (  )        ",
          "emp_hm_mobile": "+34  (  )        ",
          "emp_oth_email": "",
          "emp_work_extphone": "99  ",
          "emp_work_telephone": "+88  (  )        ",
          "emp_work_mobile": "+77  (  )        ",
          "emp_work_email": "",
          "emp_work_default_email": 1,
          "emp_username": employee.emp_username,
          "work_station": 0,
          "emp_email_exclude": null
        }
        return this.httpCoreService.postData<boolean>(`${this.httpCoreService.baseUrl}${_ins}`, _employeeIns).pipe(
          switchMap((value: boolean) => {
            return of(value);
          })
        )
        break;

      default:
        let _employeeUpd = {
          "EmployeeID": employee.EmployeeID,
          "EmployeeNumber": employee.EmployeeNumber,
          "Title": "",
          "JMB": "1234567890123",
          "FirstName": employee.FirstName,
          "MiddleName": "",
          "LastName": employee.LastName,
          "BrSocOsig": "9999999",
          "Opc_Stanovanja": "BH0000",
          "Djeca": 0,
          "RadnoMjesto": 0,
          "PostalCode": "",
          "DepartmentID": 1,
          "OfficeLocation": "",
          "Dat_Rodjenja": "0000-00-00",
          "Dat_Zaposl": "1993-12-02",
          "Dat_Odlaska": "0001-01-01",
          "Aktivan": true,
          "Razlog_Odlaska": "...",
          "DepartmentUP": employee.DepartmentUP,
          "Pol": "M",
          "ImeRoditelja": "",
          "Broj_LK": "x",
          "Mjesto_LK": "",
          "Opcina_LK": "",
          "Drzavljanstvo": "",
          "Narod": "",
          "BracnoStanje": "",
          "emp_hm_telephone": "+12  (  )        ",
          "emp_hm_mobile": "+34  (  )        ",
          "emp_oth_email": "",
          "emp_work_extphone": "99  ",
          "emp_work_telephone": "+88  (  )        ",
          "emp_work_mobile": "+77  (  )        ",
          "emp_work_email": "",
          "emp_work_default_email": 1,
          "emp_username": employee.emp_username,
          "work_station": 0,
          "emp_email_exclude": null
        };

        return this.httpCoreService.putData<boolean>(`${this.httpCoreService.baseUrl}${_upd}`, _employeeUpd).pipe(
          switchMap((value: boolean) => {
            return of(value);
          })
        )
    }



  }

  delEmployee(employee: EmployeeRec): Observable<any> {

    let _sptype: string = "delOrganizacija";

    let _employee = {
      EmployeeID: employee.EmployeeID,
      EmployeeNumber: employee.EmployeeNumber
    };

    return this.httpCoreService.delData(`${this.httpCoreService.baseUrl}${_sptype}`, _employee).pipe(
      switchMap((value: number) => {

        return of(value);
      }
      )
    )

  }

}
