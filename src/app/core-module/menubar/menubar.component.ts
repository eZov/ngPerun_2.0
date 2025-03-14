import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { enableRipple } from '@syncfusion/ej2-base';
import { MenuItemModel, MenuEventArgs, ToolbarComponent, MenuComponent } from '@syncfusion/ej2-angular-navigations';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { Router } from '@angular/router';
import { UserSessionService } from '../user-session.service';
import { AuthService } from '../auth.service';
import { LoaderService } from '../loader.service';
import { MenuService } from '../menu.service';



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
        { id: 'prijava', text: 'Prijava',  parentId: {} }
    ];    

    
    
    public userSession: UserSessionService;

    constructor(
        private router: Router,        
        public usersession: UserSessionService,
        private loaderService: LoaderService,
        private menuService: MenuService             
    ) {
        this.userSession = this.usersession;

        this.menuService.getUserLoggedIn().subscribe(userLoggedIn => {
            this.menuObj.items = userLoggedIn;
            //console.log("menubar-constructor menuService: " + JSON.stringify(userLoggedIn));
          })
    }

    ngOnInit() {

        this.loaderService.status.subscribe((val: boolean) => {
            this.showLoader = val;
        });

    }

    public select(args: any): void {

        console.log("menu event: " + args.item.id); 
        console.log("menu event: " + args.item.text);

        switch(this.usersession.role) { 
            case 'uposlenik': { 
                this.menuService.selectUpo(args.item.id);
               break; 
            }  
            case 'rukovodilac': { 
                this.menuService.selectRuk(args.item.id);
               break; 
            }             
            case 'producent': { 
                this.menuService.selectPro(args.item.id);
               break; 
            }  
            case 'sekretarica': { 
                this.menuService.selectSek(args.item.id);
               break; 
            }              
            case 'blagajna': { 
                this.menuService.selectBla(args.item.id);
               break; 
            }  
            case 'likvidatura': { 
                this.menuService.selectLik(args.item.id);
               break; 
            }  
            case 'likvidatura-ext': { 
                this.menuService.selectLikExtpl(args.item.id);
               break; 
            }  
            case 'direkcija': { 
                this.menuService.selectDir(args.item.id);
               break; 
            }                        
            case 'uprava': { 
                this.menuService.selectUpr(args.item.id);
               break; 
            }
            case 'upravafin': { 
                this.menuService.selectUprFin(args.item.id);
               break; 
            }            
            case 'administrator': { 
                this.menuService.selectAdm(args.item.id);
               break; 
            }   
            case 'ext-producent': { 
                this.menuService.selectProExt(args.item.id);
               break; 
            }  
            case 'ext-sekretarica': {
                this.menuService.selectSekExt(args.item.id);
               break; 
            }               
            case 'ext-likvidatura': { 
                this.menuService.selectLikExt(args.item.id);
               break; 
            }                                                                      
            default: { 
                this.menuService.selectDef(args.item.id);
               break; 
            } 
         }         

    }

    onLogout() {
        this.usersession.logout()
        this.menuService.setUserLoggedIn();  
        this.router.navigateByUrl("/");                      
    }

}
