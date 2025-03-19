import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../core-services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public router: Router, public auth: AuthService) {
  }

    canActivate(): boolean {
        //console.log("servis auth-guard 1");

        if (!this.auth.isAuthenticated()) {
          this.router.navigate(['login']);
          return false;
        }else{
          return true;
        }
        // let loggedIn = Math.random() < 0.5;

        // if (!loggedIn) {
        //     alert("You're not logged in and will be redirected to Login page");
        //     this.router.navigate(["/login"]);
        // }

        // return loggedIn;
    }

}