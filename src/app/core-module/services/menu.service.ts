
import { Injectable, Output, EventEmitter } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { MenuItemModel, MenuEventArgs, ToolbarComponent, MenuComponent } from '@syncfusion/ej2-angular-navigations';

import { RestDataSource } from "../../shared/rest.datasource";
import { PutnalDetail } from "../../model/putnaldetail.model";
import { Putnal } from "../../model/putnal.model";
import { UserSessionService } from './user-session.service';
import { LoaderService } from './loader.service';
import { AppRole } from "../../app-roles";

import { menuDataUpo } from "../data/menu-data-upo";
import { menuDataAdm } from "../data/menu-data-adm";
import { menuDataBla } from "../data/menu-data-bla";
import { menuDataDir } from "../data/menu-data-dir";
import { menuDataLik } from "../data/menu-data-lik";
import { menuDataPro } from "../data/menu-data-pro";
import { menuDataRuk } from "../data/menu-data-ruk";
import { menuDataSek } from "../data/menu-data-sek";
import { menuDataUpr } from "../data/menu-data-upr";
import { menuDataUprFin } from "../data/menu-data-upr-fin";

import { selectUpo } from "../helpers/navigation-helpers-upo";
import { selectRuk } from "../helpers/navigation-helpers-ruk";
import { selectPro } from "../helpers/navigation-helpers-pro";
import { selectSek } from "../helpers/navigation-helpers-sek";
import { selectBla } from "../helpers/navigation-helpers-bla";
import { selectLik } from "../helpers/navigation-helpers-lik";
import { selectDir } from "../helpers/navigation-helpers-dir";
import { selectUpr } from "../helpers/navigation-helpers-upr";
import { selectUprFin } from "../helpers/navigation-helpers-upr-fin";
import { selectAdm } from "../helpers/navigation-helpers-adm";
// import { selectProExt } from "../helpers/navigation-helpers-pro-ext";
// import { selectSekExt } from "../helpers/navigation-helpers-sek-ext";
// import { selectLikExt } from "../helpers/navigation-helpers-lik-ext";

export interface MenuItems { [key: string]: Object | null; }


@Injectable({
    providedIn: 'root'
})
export class MenuService {


    private menuLoggedIn = new Subject<{ [key: string]: Object | null }[]>();

    public menuDataLogged: { [key: string]: Object | null }[] = [];

    private menuDataDef: { [key: string]: Object | null }[] = [
        { id: 'prijava', text: 'Prijava', parentId: null }
    ];;


    @Output() change: EventEmitter<any> = new EventEmitter();



    constructor(
        private router: Router,
        private userSessionService: UserSessionService,
        private loaderService: LoaderService
    ) {
        this.menuLoggedIn.next(this.menuDataDef);
    }


    setMenu() {
        switch (this.userSessionService.user.role) {
            case AppRole.Uposlenik: {
                this.menuDataLogged = menuDataUpo;
                break;
            }
            case AppRole.Rukovodilac: {
                this.menuDataLogged = menuDataRuk;
                break;
            }
            case AppRole.Producent: {
                this.menuDataLogged = menuDataPro;
                break;
            }
            case AppRole.Sekretarica: {
                this.menuDataLogged = menuDataSek;
                break;
            }
            case AppRole.Blagajna: {
                this.menuDataLogged = menuDataBla;
                break;
            }
            case AppRole.Likvidatura: {
                this.menuDataLogged = menuDataLik;
                break;
            }
            case AppRole.Direkcija: {
                this.menuDataLogged = menuDataDir;
                break;
            }
            case AppRole.Uprava: {
                this.menuDataLogged = menuDataUpr;
                break;
            }
            case AppRole.UpravaFin: {
                this.menuDataLogged = menuDataUprFin;
                break;
            }
            case AppRole.Administrator: {
                this.menuDataLogged = menuDataAdm;
                break;
            }
            default: {
                this.menuDataLogged = this.menuDataDef;
                break;
                break;
            }
        }
    }


    setMenuLoggedIn() {
        this.setMenu();
        this.menuLoggedIn.next(this.menuDataLogged);
    }

    getMenuLoggedIn(): Observable<{ [key: string]: Object | null }[]> {
        return this.menuLoggedIn.asObservable();
    }



    public selectMenu(id: string) {

        switch (this.userSessionService.user.role) {
            case AppRole.Uposlenik: {
                selectUpo(id, this.router, this.userSessionService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.Rukovodilac: {
                selectRuk(id, this.router, this.userSessionService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.Producent: {
                selectPro(id, this.router, this.userSessionService, this.loaderService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.Sekretarica: {
                selectSek(id, this.router, this.userSessionService, this.loaderService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.Blagajna: {
                selectBla(id, this.router, this.userSessionService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.Likvidatura: {
                selectLik(id, this.router, this.userSessionService, this.loaderService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.Direkcija: {
                selectDir(id, this.router, this.userSessionService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.Uprava: {
                selectUpr(id, this.router, this.userSessionService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.UpravaFin: {
                selectUprFin(id, this.router, this.userSessionService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            case AppRole.Administrator: {
                selectAdm(id, this.router, this.userSessionService, this.route_prip_pregled, this.route_obr_pregled);
                break;
            }
            default: {
                this.selectDef(id);
                break;
            }
        }

    }



    public selectDef(linkId: string) {
        switch (linkId) {
            default: {
                this.router.navigate(['/login']);
                break;
            }
        }
    }


    private route_prip_pregled(_bylist: string) {
        this.router.navigate(['/pro_pregledput', _bylist, this.userSessionService.apiDays, 'priprema,akontacija,otvoren,odobren,aktivan']);
    }

    private route_obr_pregled(_bylist: string) {
        this.router.navigate(['/obr_pregledput', _bylist, this.userSessionService.apiDays, 'popunautoku,popunjen,provjeren,obracunutoku,obracunfin,obracunat,opravdan']);
    }

}