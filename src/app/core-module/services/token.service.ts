import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RestDataSource } from "../../shared/rest.datasource";
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpCoreService } from './http-core.service';
import { UserSessionService } from './user-session.service';
import { AppJwtService } from './app-jwt.service';
import { AppService } from '../../services/app.service';

const jwtHelper = new JwtHelperService();



@Injectable({
    providedIn: 'root'
  })
export class TokenService {

  private auth_token: string;

  constructor(
    private appService: AppService,
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
