import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../services/user-session.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'nga-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

public userSession : UserSessionService;


  constructor(
    private usersession: UserSessionService,
    private auth: AuthService,
    private router: Router
    ) { 

    console.log("navbar - " +JSON.stringify(this.usersession));
    
    this.userSession = this.usersession;

  }

  ngOnInit() {
  }

  onLogout() {
    this.auth.logout();
    //this.loggedIn = false;
    this.usersession.loggedIn = false;

    this.usersession.role = '';
    this.router.navigateByUrl("/");
  }
}
