import { Injectable } from '@angular/core';
import { Observable, of, Subject, pipe, switchMap } from 'rxjs';
import { RestDataSource } from "../shared/rest.datasource";
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpCoreService } from './http-core.service';
import { UserSessionService } from './user-session.service';
import { AppJwtService } from './app-jwt.service';
import { AppService } from '../services/app.service';
import { TokenService } from './token.service';

const jwtHelper = new JwtHelperService();

export interface AuthToken {
  success: boolean;
  token: string;
}

@Injectable()
export class AuthService {

  private SumSatiObs = new Subject<boolean>();
  // auth_token: string;

  constructor(
    private httpCoreService: HttpCoreService,
    private appJwtService: AppJwtService,
    private appService: AppService,
    private tokenService: TokenService,
    private usersession: UserSessionService,
    private restDatasource: RestDataSource
  ) {
    // this.auth_token = '';
  }

  public authenticate(username: string, password: string): Observable<boolean> {

    return this.httpCoreService.authenticate<AuthToken>(username, password).pipe(
      switchMap((value: AuthToken) => {
        if (value.success) {
          this.tokenService.setToken(value.token);

          const tokenUser = this.appJwtService.userPayload(this.tokenService.getToken());
          Object.assign(this.usersession, tokenUser);

          this.appService.setUserLoggedIn(true)

        }
        return of(value.success);
      }
      )
    )


  }

  getSumSati(): Observable<boolean> {
    return this.SumSatiObs.asObservable();
  }


  authrole(role: string): Observable<boolean> {
    return this.restDatasource.authrole(role);
  }

  get authenticated(): boolean {
    return this.restDatasource.auth_token != null;
  }

  logout(): boolean {

    this.tokenService.setToken('');
    this.appService.setUserLoggedIn(false);
    this.usersession.loggedIn = false;
    this.usersession.role = '';

    if (this.tokenService.getToken() == '') {
      return true;
    } else {
      return false;
    }
  }

  public isAuthenticated(): boolean {

    if (this.restDatasource.auth_token != null) {
      const token = this.restDatasource.auth_token;

      return !jwtHelper.isTokenExpired(token);
    } else {
      return false;
    }
  }

  menusbyrole(): Observable<{ [key: string]: Object }[]> {
    return this.restDatasource.menusbyrole();
  }

}
