import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EnvService } from '../../env.service';
import { TokenService } from './token.service';
import { AppRole } from '../../app-roles';

const PROTOCOL = "https";
const PORT = 443;
@Injectable({
  providedIn: 'root',
})
export class HttpCoreService {

  baseUrl: string;
  sptype: string;

  constructor(
        private env: EnvService,
        private http: HttpClient,
        private tokenService: TokenService
    ) {
        this.baseUrl = this.env.apiUrl;  
        this.sptype = '';      
    }

  private getOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.getToken()}`,
      }),
    };
  }
      
  authenticate<AuthToken>(user: string, pass: string): Observable<AuthToken> {
    return this.http
      .post<any>(this.baseUrl + "login", {
        email: user,
        password: pass,
        role: AppRole.Uposlenik,
      });
  }

  getData<T>(apiUrl: string): Observable<T> {
    return this.http.get<T>(apiUrl, this.getOptions());
  }

  postData<T>(apiUrl: string, data: any): Observable<T> {
    return this.http.post<T>(apiUrl, data, this.getOptions());
  }
}
