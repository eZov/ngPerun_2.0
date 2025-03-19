import { Injectable } from '@angular/core';
import { Observable, of, Subject, pipe, switchMap, delay } from 'rxjs';
import { RestDataSource } from "../shared/rest.datasource";
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpCoreService } from './http-core.service';
import { UserSessionService } from './user-session.service';
import { AppJwtService } from './app-jwt.service';
import { AppService } from './app.service';
import { TokenService } from  './token.service';

const jwtHelper = new JwtHelperService();

export interface AuthToken {
  success: boolean;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
  role: string;
}

@Injectable()
export class AuthService {

  private SumSatiObs = new Subject<boolean>();
  // auth_token: string;

  constructor(
    private httpCoreService: HttpCoreService,
    private appJwtService: AppJwtService,
    private tokenService: TokenService,
    private userSessionService: UserSessionService,
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
          //Object.assign(this.userSessionService, tokenUser);
          console.log("AuthService.authenticate: " + JSON.stringify(tokenUser));

          this.userSessionService.setUser(tokenUser);
          this.userSessionService.setLoggedIn(true)

        }
        return of(value.success);
      }
      )
    )

  }

  changeRole(role: string): Observable<boolean> {

    return this.httpCoreService.postData<AuthToken>(`${this.httpCoreService.baseUrl}authrole`,
      {
        email: this.userSessionService.user.email,
        password: '',
        role: role
      }).pipe(
        switchMap((value: AuthToken) => {
          if (value.success) {

            this.tokenService.setToken(value.token);
            const tokenUser = this.appJwtService.userPayload(this.tokenService.getToken());

            console.log("AuthService.changerole: " + JSON.stringify(tokenUser));

            this.userSessionService.setUser(tokenUser);
            this.userSessionService.setLoggedIn(true)
          }
          return of(value.success);
        }
        )
      )

    //return of(true).pipe(delay(2000));
  }

  changePassword( oldPass: string, newPass: string): Observable<boolean> {

    return this.httpCoreService.postData<AuthToken>(`${this.httpCoreService.baseUrl}changepassword`,
      {
        email: this.userSessionService.user.email,
        password: newPass,
        role: oldPass
      }).pipe(
        switchMap((value: AuthToken) => {
          if (value.success) {

            this.tokenService.setToken(value.token);
            const tokenUser = this.appJwtService.userPayload(this.tokenService.getToken());

            console.log("AuthService.changerole: " + JSON.stringify(tokenUser));

            this.userSessionService.setUser(tokenUser);
            this.userSessionService.setLoggedIn(true)
          }
          return of(value.success);
        }
        )
      )

    //return of(true).pipe(delay(2000));
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
    this.userSessionService.setLoggedIn(false);
    this.userSessionService.user.role = '';

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
