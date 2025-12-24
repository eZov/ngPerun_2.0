import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core-services/auth.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { UserSessionService } from '../../../core-services/user-session.service';
import { LoaderService } from '../../../core-services/loader.service';

import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from '../../../core-services/menu.service';

import { User } from '../../user.model';
import { Observable, of, Subscription } from 'rxjs';
import { ToastUtility, ToastComponent, ToastModel } from '@syncfusion/ej2-angular-notifications';
import { ToastService } from '../../../toasts/toast.service';
import { NotificationService } from '../../../core-services/notification.service';






@Component({
  selector: 'nga-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private subs: Subscription[] = [];

  public toastObj?: ToastComponent;

  @ViewChild('ddlelement', { static: false })
  public dropDownList!: DropDownListComponent;

  @ViewChild('dockBar', { static: false }) dockBar!: SidebarComponent;

  @ViewChild("toast") toast!: ElementRef;


  public username!: string;
  public password!: string;
  public errorMessage!: string;

  public passwordOld!: string;
  public passwordNew!: string;

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
    private toastService: ToastService,
    private notificationService: NotificationService
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

    const sub1 = this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
    this.subs.push(sub1);

    const sub2 = this.userSessionService.getLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      console.log("login loggedIn: " + loggedIn);
    })
    this.subs.push(sub2);

    const sub3 = this.userSessionService.getUser().subscribe(user => {
      this.role = user.role;
      this.email = user.email;
      this.userRoles = JSON.parse(JSON.stringify(user.UserRoles));
      this.currentRole = user.role;
      console.log("login getUser: " + JSON.stringify(user));
    })
    this.subs.push(sub3);

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
            this.toastService.reportSuccessToast({
              title: 'PRIJAVA',
              content: 'Uspješno ste se prijavili na sistem'
            });

            this.notificationService.getNotification(999);
          }
          this.loaderService.display(false);
        },
        error: error => {
          console.error('Error:', error)
          this.loaderService.display(false);

          this.toastService.reportErrorToast({
            title: 'Greška tokom prijave',
            content: 'Došlo je do greške tokom prijave: provjerite da li imate prava pristupa i da li su validni vaši podaci za prijavu (korisničko ime i lozinka)'
          });

        },
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

    console.log("changePassword: " + this.passwordOld + " " + this.passwordNew);

    this.auth.changePassword(this.passwordOld, this.passwordNew)
      .subscribe({
        next: (value: boolean) => {
          if (value) {
            console.log("login changePassword 1: " + JSON.stringify(value));
            this.toastService.reportSuccessToast({
              title: 'Uspješna promjena lozinke',
              content: 'Uspješno ste promjenili lozinku. Sad ćete biti odjavljeni iz sistema, te se morate ponovo prijaviti sa novom lozinkom.'
            });

            this.auth.logout();
            this.menuService.setMenuLoggedIn();
            this.router.navigateByUrl("/");
          } else {

            console.log("login changePassword 2: " + JSON.stringify(value));
            this.toastService.reportErrorToast({
              title: 'Greška tokom promjene lozinke',
              content: 'Došlo je do greške tokom promjene lozinke: provjerite da li su validni vaši podaci za promjenu lozinke (stara i nova lozinka)'
            });
          }
        },
        error: error => {
          console.error('Error:', error)
        }
      })
  }

  //HACK: postavlja se parametar za UserSession
  changeSetPerRole() {
    this.userSessionService.changeSetPerRole();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    console.log('login-ngOnDestroy...');
  }
}
