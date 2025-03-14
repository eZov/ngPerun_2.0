import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { RestDataSource } from '../../shared/rest.datasource';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { UserSessionService } from '../user-session.service';
import { LoaderService } from '../loader.service';

import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { AppService } from '../../services/app.service';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from '../menu.service';

import { AppJwtService } from '../app-jwt.service';
import { User } from '../user.model';






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
  public loginMessage!: string;
  public errorMessage!: string;
  public loggedIn!: boolean;
  public userRoles!: string[];
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
    public usersession: UserSessionService,
    private menuService: MenuService,
    // private pnStatus: PutnalWorkflowService        
  ) {

    this.cardHtml = activeRoute.snapshot.params["mode"];
    console.log("login constructor: ", this.cardHtml);
  }

  ngOnInit() {

    this.usersession.loggedIn = this.auth.isAuthenticated();
    this.loggedIn = this.usersession.loggedIn;

    this.loginMessage = "";

    if (this.auth.isAuthenticated()) {
      this.usersession.loggedIn = true;
      this.loginMessage = this.usersession.email + " kao " + this.usersession.role;
    } else {
      this.usersession.loggedIn = false;
      this.loginMessage = '';
    }

    // if (this.datasource.auth_token != null) {
    //   const token = this.datasource.auth_token;

    //   //decode the token to get its payload
    //   let tokenUser: User = this.appJwtService.userPayload(token);

    //   this.userRoles = tokenUser.UserRoles || [];
    //   this.userRoles = tokenUser.UserRoles || [];
    //   this.currentRole = tokenUser.role || '';
    // }

    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

    this.loaderService.display(false);


    console.log("login ngOnInit: ", this.loginMessage);
  }

  ngAfterViewInit() {

    // if ((this.datasource.auth_token != null) && (this.cardHtml === 'changerole')) {
    //   this.dropDownList.value = this.usersession.role;
    // }

  }

  authenticate(form: NgForm) {

    if (form.valid) {
      this.loaderService.display(true);

      this.auth.authenticate(this.username, this.password).subscribe({
        next: (value: boolean) => {
          if (value) {
            console.log('---> login successful: ' + JSON.stringify(this.usersession.email));

            this.usersession.loggedIn = true;
            this.loginMessage = this.usersession.email + " kao " + this.usersession.role;
            this.menuService.setUserLoggedIn();
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
  

  // authenticate(form: NgForm) {
  //   if (form.valid) {
  //     this.loaderService.display(true);
  //     this.auth.authenticate(this.username, this.password)
  //       .subscribe(
  //         response => {
  //           if (response) {
  //             if (this.datasource.auth_token != null) {
  //               const token = this.datasource.auth_token;

  //               //decode the token to get its payload
  //               const tokenUser = this.appJwtService.userPayload(token);
  //               Object.assign(this.usersession, tokenUser);


  //               console.log('login token: ' + JSON.stringify(tokenUser));

  //               this.changeSetPerRole();

  //               this.usersession.apiList = this.usersession.empId;

  //               this.usersession.loggedIn = true
  //               this.usersession.gridCurrentPage["evid_kontrola"] = 1;
  //               this.usersession.gridPageSize["evid_kontrola"] = 12;

  //               let _existIdle: boolean = this.cookieService.check('perun.' + this.usersession.empId.toString());
  //               let _idleTime: number = +this.cookieService.get('perun.' + this.usersession.empId.toString());
  //               console.log("login: ", this.loginMessage + " idleTime:" + _idleTime);
  //               this.usersession.idleTime = (_existIdle === true) ? +this.cookieService.get('perun.' + this.usersession.empId.toString()) : 300;
  //               // Idle log out
  //               //this.usersession.idleTime = 10;
  //               this.appService.setUserLoggedIn(true)
  //               this.menuService.setUserLoggedIn();


  //             }
  //             this.loaderService.display(false);
  //             this.router.navigateByUrl("/");
  //           }

  //         },
  //         err => {
  //           this.errorMessage = "Prijava nije uspjela";
  //           console.log(err);
  //           this.loaderService.display(false);
  //         })
  //   } else {
  //     this.loginMessage = "Form Data Invalid";
  //   }
  // }

  logout() {
    if (this.auth.logout() === true) {
      this.loginMessage = '';
      this.router.navigate(['/']);
    }else{
      this.loginMessage = "Logout failed!";
    }
  }

  changeRole() {

    let selRole: string = this.dropDownList.text!;

    this.loaderService.display(true);
    this.auth.authrole(selRole)
      .subscribe(response => {
        if (response) {
          //this.router.navigateByUrl("/");
          //TODO Ne tretira kada rola nije uspješno promijenjena - 
          //API wLI2 RoleChange - succes treba biti true samo kada je rola uspješno promijenjena
          // if (this.datasource.auth_token != null) {
          //   const token: string = this.datasource.auth_token;

          //   //decode the token to get its payload
          //   const tokenUser = this.appJwtService.userPayload(token);
          //   Object.assign(this.usersession, tokenUser);

          //   console.log('login token: ' + JSON.stringify(tokenUser));
          //   this.loginMessage = tokenUser.email + " kao " + tokenUser.role;

          //   this.changeSetPerRole();
          //   this.menuService.setUserLoggedIn();
          //   this.loaderService.display(false);
          // }

        } else {
          this.loginMessage = "Promjena uloge nije uspjela!";
          this.loaderService.display(false);
        }
        //this.loginMessage = "Authentication Failed";
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
          this.loginMessage = "Promjena uloge nije uspjela!";
        }
        //this.loginMessage = "Authentication Failed";
      })


  }

  //HACK: postavlja se parametar za UserSession
  changeSetPerRole() {

    switch (this.usersession.role) {
      case "blagajna":
      case "uposlenik": {
        this.usersession.unosNaloga = false;
        this.usersession.apiList = -1;
        break;
      }
      case "likvidatura":
      case "rukovodilac": {
        this.usersession.unosNaloga = true;
        this.usersession.apiList = -1;
        break;
      }
      case "sekretarica":
      case "producent": {
        this.usersession.unosNaloga = true;
        this.usersession.apiList = this.usersession.empId;
        break;
      }
      case "direkcija": {
        this.usersession.unosNaloga = true;
        this.usersession.apiList = -1;
        break;
      }
      case "uprava": {
        this.usersession.unosNaloga = true;
        this.usersession.apiList = -1;
        break;
      }
      default: {
        //statements; 
        break;
      }
    }

    this.usersession.nalogsPerPage = 15;
  }
}
