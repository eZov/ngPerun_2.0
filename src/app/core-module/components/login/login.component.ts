import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { UserSessionService } from '../../services/user-session.service';
import { LoaderService } from '../../services/loader.service';

import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from '../../services/menu.service';

import { User } from '../../user.model';
import { Observable, of } from 'rxjs';






@Component({
  selector: 'nga-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('ddlelement', { static: false })
  public dropDownList!: DropDownListComponent;

  @ViewChild('dockBar', { static: false }) dockBar!: SidebarComponent;

  private _user: User = new User();

  public username!: string;
  public password!: string;
  public errorMessage!: string;

  public loggedIn: boolean = false;
  public email: string = '';
  public role: string = '';

  public userRoles: string[] = [];
  public currentRole!: string;

  showLoader!: boolean;

  public cardHtml: string;

  public enableDock: boolean = true;

  public width: string = '220px';
  public dockSize: string = '72px';
  toggleClick() {
    this.dockBar.toggle();
  }

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private auth: AuthService,
    public userSessionService: UserSessionService,
    private menuService: MenuService,
    // private pnStatus: PutnalWorkflowService        
  ) {

    this.cardHtml = activeRoute.snapshot.params["mode"];
    console.log("login constructor: ", this.cardHtml + " loggedIn: " + this.loggedIn);
  }

  ngOnInit() {

    this.userRoles = [];
    this.currentRole = '';
    this.role = '';
    this.email = '';
    this.loggedIn = false;

    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

    this.userSessionService.getLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      console.log("login loggedIn: " + loggedIn);
    })

    this.userSessionService.getUser().subscribe(user => {
      this.role = user.role;
      this.email = user.email;
      this.userRoles = JSON.parse(JSON.stringify(user.UserRoles));
      this.currentRole = user.role;
    })

    this.loaderService.display(false);
  }


  authenticate(form: NgForm) {

    if (form.valid) {
      this.loaderService.display(true);

      this.auth.authenticate(this.username, this.password).subscribe({
        next: (value: boolean) => {
          if (value) {
            console.log('---> login successful: ' + JSON.stringify(this.userSessionService.user.email));

            this.menuService.setMenuLoggedIn();
            this.router.navigateByUrl("/");
          }

          console.log('---> login unsuccessful!!! ');
        },
        error: error => console.error('Error:', error),
        complete: () => {
          console.log('Complete');
        }
      });

    }

  }


  logout() {
    if (this.auth.logout() === true) {
      this.router.navigate(['/']);
    }
  }

  changeRole() {

    let selRole: string = this.dropDownList.text || '';
    this.loaderService.display(true);

    this.auth.changeRole(selRole)
      .subscribe(response => {
        if (response) {
          this.loaderService.display(false);
          console.log("login changeRole: " + selRole);

          this.menuService.setMenuLoggedIn();
          this.router.navigateByUrl("/");
        } else {
          this.loaderService.display(false);
        }

      })
  }

  changePassword() {

    let selRole: string = this.dropDownList.text!;

    this.auth.authrole(selRole)
      .subscribe(response => {
        if (response) {
          //this.router.navigateByUrl("/");
          //TODO Ne tretira kada rola nije uspješno promijenjena - 
          //API wLI2 RoleChange - succes treba biti true samo kada je rola uspješno promijenjena
          // if (this.datasource.auth_token != null) {
          //   const token = this.datasource.auth_token;

          //   //decode the token to get its payload
          //   const tokenUser = this.appJwtService.userPayload(token);
          //   Object.assign(this.usersession, tokenUser);


          //   console.log('login token: ' + JSON.stringify(tokenUser));

          //   // this.userRoles = tokenPayload.UserRoles;
          //   // this.currentRole = tokenPayload.role;
          //   // this.loginMessage = tokenPayload.email + " kao " + tokenPayload.role;

          //   // this.usersession.role = tokenPayload.role;
          //   // this.usersession.email = tokenPayload.email;
          //   this.changeSetPerRole();

          // }

        } else {
        }
        //this.loginMessage = "Authentication Failed";
      })


  }

  //HACK: postavlja se parametar za UserSession
  changeSetPerRole() {
    this.userSessionService.changeSetPerRole();
  }
}
