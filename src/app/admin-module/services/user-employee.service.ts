import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { forkJoin, Observable, of } from "rxjs";
import { shareReplay, catchError, map, switchMap } from 'rxjs/operators';


import { HttpCoreService } from "../../core-services/http-core.service";
import { AdmEmployee } from "../../model/adm-employees.model";

@Injectable({
    providedIn: 'root'
})
export class UserEmployeeService implements Resolve<any> {


    constructor(
        private httpCoreService: HttpCoreService
    ) {

        console.log("admEmployeesTable.construct");
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let _sptype: string = "getemployeelist";
        let _org: string = "byorgpg";

        return this.httpCoreService.getData<AdmEmployee[]>(`${this.httpCoreService.baseUrl}${_sptype}?list=${_org}&vrsta=1`).pipe(
            switchMap((value: AdmEmployee[]) => {

                return of(value);
            }
            )
        )
    }

    listUserEmployeeBySifra(
        _sifra: string
    ): Observable<AdmEmployee[]> {

        let _sptype: string = "GetUserEmployeeList";
        return this.httpCoreService.getData<AdmEmployee[]>(`${this.httpCoreService.baseUrl}${_sptype}?org=${_sifra}`).pipe(
            switchMap((value: AdmEmployee[]) => {
                return of(value);
            }
            )
        )
    }

    //API:aUC kreiraj usera
    createUser(_employeeId: number, _email: string): Observable<AdmEmployee[]> {

        let _sptype: string = "createuser";
        return this.httpCoreService.getData<AdmEmployee[]>(`${this.httpCoreService.baseUrl}${_sptype}?pEmail=${_email}&pEmployeeId=${_employeeId}`).pipe(
            switchMap((value: AdmEmployee[]) => {
                return of(value);
            }
            )
        )
    }

    //API:aUW set web access za usera
    setWebAccess(_email: string, _webaccess: boolean): Observable<boolean> {

        let _sptype: string = "setwebaccess";
        return this.httpCoreService.getData<boolean>(`${this.httpCoreService.baseUrl}${_sptype}?pEmail=${_email}&pWebAccess=${_webaccess}`).pipe(
            switchMap((value: boolean) => {
                return of(value);
            }
            )
        )
    }

    //API:aUW set web access za usera
    delMobAccess(_email: string): Observable<boolean> {

        let _sptype: string = "SetMobAccess";
        return this.httpCoreService.getData<boolean>(`${this.httpCoreService.baseUrl}${_sptype}?pEmail=${_email}&pMobAccess=false`).pipe(
            switchMap((value: boolean) => {
                return of(value);
            }
            )
        )
    }

    processWebAccess(_userEmployeeData: AdmEmployee[]): Observable<boolean> {

        // Kreiranje liste observables za HTTP pozive
        const requests: Observable<any>[] = _userEmployeeData.map((element: AdmEmployee) => {
            if (element.WebUser === true) {
                const webAccessObservable = this.setWebAccess(element.Email ?? "", element.WebAccess ?? false).pipe(
                    switchMap((result) => {
                        console.log("set web accessusers..." + _userEmployeeData.length + " : " + result);
                        // if (element.MobUser === false) {
                        //     return this.delMobAccess(element.Email ?? "").pipe(
                        //         catchError(err => {
                        //             console.log(err);
                        //             return of(null);
                        //         })
                        //     );
                        // }
                        return of(result);
                    })
                );
                return webAccessObservable;
            } else {
                const createUserObservable = this.createUser(element.EmployeeID ?? -1, element.Email ?? "").pipe(
                    map((result) => {
                        console.log("inserting users..." + " : " + result);
                        return result;
                    }),
                    catchError((err) => {
                        console.log(err);
                        return of(null);
                    })
                );
                return createUserObservable;
            }
        });

        // Praćenje završetka svih HTTP poziva
        return forkJoin(requests).pipe(
            map((responses) => {
                console.log('Svi pozivi su uspješno završeni:', responses);
                return true;
            }),
            catchError((error) => {
                console.error('Greška tokom slanja:', error);
                return of(false);
            })
        );



    }

    resetpassword(_email: string): Observable<any> {

        let _sptype: string = "resetpassword";
        return this.httpCoreService.postData<any>(`${this.httpCoreService.baseUrl}${_sptype}?`, {
            email: _email,
        }).pipe(
            switchMap((value: AdmEmployee[]) => {
                return of(value);
            }
            )
        )
    }

}
