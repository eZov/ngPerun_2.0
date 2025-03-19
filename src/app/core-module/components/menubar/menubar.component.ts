import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { enableRipple } from '@syncfusion/ej2-base';
import { MenuItemModel, MenuEventArgs, ToolbarComponent, MenuComponent } from '@syncfusion/ej2-angular-navigations';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { Router } from '@angular/router';
import { UserSessionService } from '../../../core-services/user-session.service';
import { LoaderService } from '../../../core-services/loader.service';
import { MenuService } from  '../../../core-services/menu.service';
import { AuthService } from '../../../core-services/auth.service';




@Component({
    selector: 'nga-menubar',
    templateUrl: './menubar.component.html',
    styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

    showLoader!: boolean;

    @ViewChild('menuDef', { static: false })
    public menuObj!: MenuComponent;

    // Menu items definition 
    public menuDataDefault: { [key: string]: Object }[] = [
        { id: 'prijava', text: 'Prijava', parentId: {} }
    ];

    public loggedIn: boolean = false;
    public email: string = 'email';
    public role: string = 'role';

    // public userSesion: UserSessionService;

    constructor(
        private router: Router,
        private authService: AuthService,
        public userSessionService: UserSessionService,
        private loaderService: LoaderService,
        private menuService: MenuService
    ) {
        // this.userSesion = userSessionService;
        // console.log("menubar-constructor userSessionService: " + JSON.stringify(userSessionService));
    }

    ngOnInit() {

        this.role = "role-ngOnInit";
        this.email = "email-ngOnInit";
        console.log("menubar-c userSessionService 0: " + this.role + " " + this.email);

        this.loaderService.status.subscribe((val: boolean) => {
            this.showLoader = val;
        });

        this.menuService.getMenuLoggedIn().subscribe(userLoggedIn => {
            this.menuObj.items = userLoggedIn;
            console.log("menubar-c menuService: " + JSON.stringify(userLoggedIn));
        })

        this.userSessionService.getLoggedIn().subscribe(loggedIn => {
            this.loggedIn = loggedIn;
            console.log("menubar-c userSessionService 1: " + loggedIn);
        })

        this.userSessionService.getUser().subscribe(user => {
            this.role = user.role;
            this.email = user.email;
            console.log("menubar-c userSessionService 2: " + this.role + " " + this.email);
        })



    }

    public select(args: any): void {

        console.log("menu event: " + args.item.id);
        console.log("menu event: " + args.item.text);

        this.menuService.selectMenu(args.item.id);

        // switch (this.userSessionService.user.role) {
        //     case AppRole.Uposlenik: {
        //         this.menuService.selectUpo(args.item.id);
        //         break;
        //     }
        //     case 'rukovodilac': {
        //         this.menuService.selectRuk(args.item.id);
        //         break;
        //     }
        //     case 'producent': {
        //         this.menuService.selectPro(args.item.id);
        //         break;
        //     }
        //     case 'sekretarica': {
        //         this.menuService.selectSek(args.item.id);
        //         break;
        //     }
        //     case 'blagajna': {
        //         this.menuService.selectBla(args.item.id);
        //         break;
        //     }
        //     case 'likvidatura': {
        //         this.menuService.selectLik(args.item.id);
        //         break;
        //     }
        //     case 'likvidatura-ext': {
        //         this.menuService.selectLikExtpl(args.item.id);
        //         break;
        //     }
        //     case 'direkcija': {
        //         this.menuService.selectDir(args.item.id);
        //         break;
        //     }
        //     case 'uprava': {
        //         this.menuService.selectUpr(args.item.id);
        //         break;
        //     }
        //     case 'upravafin': {
        //         this.menuService.selectUprFin(args.item.id);
        //         break;
        //     }
        //     case 'administrator': {
        //         this.menuService.selectAdm(args.item.id);
        //         break;
        //     }
        //     case 'ext-producent': {
        //         this.menuService.selectProExt(args.item.id);
        //         break;
        //     }
        //     case 'ext-sekretarica': {
        //         this.menuService.selectSekExt(args.item.id);
        //         break;
        //     }
        //     case 'ext-likvidatura': {
        //         this.menuService.selectLikExt(args.item.id);
        //         break;
        //     }
        //     default: {
        //         this.menuService.selectDef(args.item.id);
        //         break;
        //     }
        // }

    }

    onLogout() {
        if (this.authService.logout() === true) {

        }

        this.menuService.setMenuLoggedIn();
        this.router.navigateByUrl("/");
    }

}
