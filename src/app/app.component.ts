import { Component, ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '../environments/environment';
import { EnvService } from './env.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppService } from './core-services/app.service';
// import { UserSessionService } from './services/user-session.service';
import { AuthService } from './core-services/auth.service';
import { MenuService } from './core-services/menu.service';
import { LoaderService } from './core-services/loader.service';
import { UserSessionService } from './core-services/user-session.service';
// import { PutnalWorkflowService } from './services/putnal-workflow.service';

@Component({
  selector: 'nga-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //title = 'ngPerun';
  public restURL!: string;

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = undefined;
  title = 'angular-idle-timeout';

  public modalRef!: BsModalRef;

  @ViewChild('childModal', { static: false }) childModal!: ModalDirective;
  @ViewChild("toast") toast!: ElementRef;
  
  currentRoute: string;

  constructor(
    private idle: Idle, 
    private keepalive: Keepalive, 
    private router: Router, 
    private modalService: BsModalService, 
    private appService: AppService,
    private userSessionService: UserSessionService,
    private auth: AuthService,
    private menuService: MenuService,
    private loaderService: LoaderService         
    ) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(300);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(15);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => { 
      this.idleState = 'Ponovo ste aktivni...'
      console.log(this.idleState);
      this.reset();
    });
    
    idle.onTimeout.subscribe(() => {

      this.childModal.hide();
      this.idleState = 'Odjavljeni ste zbog neaktivnosti!';
      this.timedOut = true;
      console.log(this.idleState);

      this.auth.logout();
      this.menuService.setMenuLoggedIn();        
       this.router.navigateByUrl("/");             

    });
    
    idle.onIdleStart.subscribe(() => {
        this.idleState = 'Neaktivni ste duže od 5 minunta...!'
        console.log(this.idleState);
        this.childModal.show();
    });
    
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'Bićete odjavljeni za ' + countdown + ' sekundi!'
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.userSessionService.getLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.setIdle(this.userSessionService.idleTime);
        idle.watch()
        this.timedOut = false;

      } else {
        idle.stop();
      }
    })


    this.currentRoute = "";
    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
            console.log('Route change detected url:' + event.url);            
            console.log(event);    
            this.userSessionService.navigateUrl(event.url);        
            this.loaderService.display(true); 
        }

        if (event instanceof NavigationEnd) {
            this.currentRoute = event.url;          
            console.log('End of route change');            
              //console.log(event);
              this.loaderService.display(false);               
        }

        if (event instanceof NavigationError) {
            this.loaderService.display(false); 
            console.log(event.error);
        }
    });


  }

  reset() {
    this.idle.watch();
    this.idleState = 'Ponovo ste aktivni...';
    this.timedOut = false;
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.reset();
  }

  // Logut kada je isteklo vrijeme
  logout() {
    this.childModal.hide();

    this.auth.logout();
  }


}
