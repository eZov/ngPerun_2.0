import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { User } from '../core-module/user.model';
import { AppRole } from '../app-roles';

@Injectable({
  providedIn: 'root'
})
export class AppJwtService {


  constructor() { }

  userPayload(token: string): User {

    const tokenPayload: User = jwtDecode<User>(token);

    //HACK: workaround for jwt-decode issue with array of roles (kad je samo jedna rola, jwt-decode vrati string, a ne niz)
    if (!Array.isArray(tokenPayload.UserRoles)) {
      tokenPayload.UserRoles = [AppRole.Uposlenik];
    }

    //HACK: workaround for jwt-decode issue with empId (nameId je string, a ne number, i vraća se u sastavu tokena)
    tokenPayload.empId = Number(tokenPayload.nameid);
    console.log('login token 1: ' + JSON.stringify(tokenPayload));

    return tokenPayload;
  }

}
