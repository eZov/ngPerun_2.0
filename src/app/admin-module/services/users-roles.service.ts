import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject, switchMap, throwError } from 'rxjs';
import { OrgJed } from '../../model/orgjed.model';
import { HttpCoreService } from '../../core-services/http-core.service';
import { LoaderService } from '../../core-services/loader.service';
import { AdmUserRoles } from '../../model/adm-user-roles.model';

@Injectable()
export class UsersRolesService {

    private usersRoles = new Subject<string[]>();
    public usersRoles$ = this.usersRoles.asObservable();

    constructor(
        protected loaderService: LoaderService,
        private httpCoreService: HttpCoreService
    ) { }


    setusersRoles(_rolesCsv: string) {
        console.log('users-roles.service _rolesCsv: ', _rolesCsv);



        this.usersRoles.next(_rolesCsv.split(",")); // Example roles for the employee
    }


}