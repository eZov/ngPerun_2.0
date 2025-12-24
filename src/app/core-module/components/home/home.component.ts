import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../../core-services/user-session.service';
import { LoaderService } from '../../../core-services/loader.service';
import { LocationService } from '../../../core-services/location.service';

import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core-services/notification.service';


@Component({
  selector: 'nga-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private subs: Subscription[] = [];

  //public userSession: UserSession;
  showLoader!: boolean;

  public loggedIn: boolean = false;
  public email: string = '';
  public role: string = '';

  public data: { [key: string]: Object }[] = [
    { Name: '5 minuta', Id: 300 },
    { Name: '10 minuta', Id: 600 },
    { Name: '15 minuta', Id: 1500 },
    { Name: '30 minuta', Id: 3000 },
    { Name: '60 minuta', Id: 6000 },
    { Name: '2 sata', Id: 12000 },
    { Name: '3 sata', Id: 18000 },
    { Name: '5 sati', Id: 30000 },
    { Name: '7 sati', Id: 42000 },
    { Name: '9 sati', Id: 54000 }
  ];

  public fields: Object = { text: 'Name', value: 'Id' };
  public height: string = '200px';
  public width: string = '100px';
  public popupWidth: string = '100px';

  constructor(
    public userSessionService: UserSessionService,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private locationService: LocationService,
    private notificationService: NotificationService
  ) {
    //this.userSession = this.usersession;  
    //console.log("home: " + JSON.stringify(usersession));    

  }



  ngOnInit() {


    const sub1 = this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
    this.subs.push(sub1);

    const sub2 = this.userSessionService.getLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      console.log("home.c sub2: " + loggedIn);
      if (loggedIn) {
        //this.notificationService.getNotification(1000);
      }
      console.log("home.c sub2 loggedIn: " + loggedIn);

    })
    this.subs.push(sub2);

    const sub3 = this.userSessionService.getUser().subscribe(user => {
      this.role = user.role;
      this.email = user.email;

      console.log("home.c sub3: " + user.email);
    })
    this.subs.push(sub3);


    this.loaderService.display(false);

  }

  onSelect(args: any): void {

    //console.log("home: " + JSON.stringify(args.itemData));    
    this.userSessionService.idleTime = args.itemData["Id"];
    this.cookieService.set('perun.' + this.userSessionService.user.empId.toString(), this.userSessionService.idleTime.toString(), 1000, "/", this.locationService.getHostname(), false, "Lax");

  }

}
