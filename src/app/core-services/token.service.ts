import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';

// import { AppService } from './app.service';

const jwtHelper = new JwtHelperService();



@Injectable({
    providedIn: 'root'
  })
export class TokenService {

  private auth_token: string;

  constructor(
    // private appService: AppService,
  ) {
    this.auth_token = '';
  }

  setToken(token: string) {
    this.auth_token = token;
  }

  getToken(): string {
    return this.auth_token;
  }
}
