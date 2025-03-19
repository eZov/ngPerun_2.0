import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { User } from '../core-module/user.model';

@Injectable({
  providedIn: 'root'
})
export class AppJwtService {


  constructor() { }

  userPayload(token: string): User {

    const tokenPayload: User = jwtDecode<User>(token);
    console.log('login token: ' + JSON.stringify(tokenPayload));

    return tokenPayload;
  }

}
