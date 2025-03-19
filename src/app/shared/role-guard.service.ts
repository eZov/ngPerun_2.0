import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from '../core-services/auth.service';
import decode from 'jwt-decode';
import { RestDataSource } from './rest.datasource';
import { AppJwtService } from '../core-services/app-jwt.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService,
    public router: Router,
    private datasource: RestDataSource,
      private appJwtService: AppJwtService,
    ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data['expectedRole'];
    const token = this.datasource.auth_token;

    if (this.datasource.auth_token != null) {

      // decode the token to get its payload
      //const tokenPayload = decode(token);
      const tokenPayload = this.appJwtService.userPayload(token);
      // Object.assign(this.usersession, tokenUser);

      if (!this.auth.isAuthenticated()) {
        // nije logovan
        this.router.navigate(['login']);
        return false;
      } else {

        if (expectedRole.indexOf(tokenPayload.role) < 0) {
          this.router.navigate(['/']);
          return false;
        }        

        return true;
      }

    }
    // token je null
    this.router.navigate(['login']);
    return false;
  }

}
