import { Router } from '@angular/router';
import { UserSessionService } from '../user-session.service';
import { LoaderService } from '../loader.service';

export function selectLik(
    linkId: string,
    router: Router,
    userSessionService: UserSessionService,
    loaderService: LoaderService,
    route_prip_pregled: (param: string) => void,
    route_obr_pregled: (param: string) => void
): void {
    switch (linkId) {
        case 'akon_putninalog': {
            loaderService.display(true);
            // router.navigate(['/pro_akontacija', usersession.apiDays, sptableapi.getPNUrlStatus_ByFlow('pro_akontacija')]);
            router.navigate(['/pro_akontacija', userSessionService.apiDays, "akontacija,prevoz,otvoren"]);
            break;
        }
        case 'akon_putninalog_ext': {
            loaderService.display(true);
            //router.navigate(['/pro_akontacija_ext', usersession.apiDays, sptableapi.getPNUrlStatus_ByFlow('pro_akontacija_ext')]);
            break;
        }
        case 'akon_putninalog_proforma': {
            loaderService.display(true);
            //router.navigate(['/pro_priprema_proforma', usersession.apiDays, 'akontacijaPF,otvorenPF']);
            router.navigate(['/pro_akontacija_proforma', userSessionService.apiDays, 'akontacijaPF,otvorenPF']);
            break;
        }
        case 'gp_akontacija': {
            router.navigate(['/gp_akontacija']);
            break;
        }
        case 'gp_akontacija_proforma': {
            router.navigate(['/gp_akontacija_proforma']);
            break;
        }
        case 'otvoreni': {
            loaderService.display(true);
            router.navigate(['/otvoreni', userSessionService.apiDays, 'otvoren,odobren']);
            break;
        }
        case 'otvoreni2': {
            loaderService.display(true);
            router.navigate(['/otvoreni2', userSessionService.apiDays, 'otvoren,odobren']);
            break;
        }
        case 'obr_kontrola': {
            // loaderService.display(true);                 
            //router.navigate(['/obr_kontrola', usersession.apiDays, sptableapi.getPNUrlStatus_ByFlow('obr_kontrola')]);
            break;
        }
        case 'obr_obracun': {
            loaderService.display(true);
            //router.navigate(['/obr_obracun', usersession.apiDays, sptableapi.getPNUrlStatus_ByFlow('obr_obracun', usersession.role)]);
            break;
        }
        case 'obr_zatvaranje': {
            router.navigate(['/putnalitem']);
            break;
        }
        case 'edit_aktivnost': {
            loaderService.display(true);
            userSessionService.apiList = -1;
            router.navigate(['/edit_aktivnost']);
            break;
        }
        case 'edit_saradnici': {
            loaderService.display(true);
            userSessionService.apiList = -1;
            router.navigate(['/edit_saradnici']);
            break;
        }
        case 'edit_person': {
            loaderService.display(true);
            userSessionService.apiList = -1;
            router.navigate(['/edit_person']);
            break;
        }
        case 'prip_pregled': {
            route_prip_pregled('byorgpg');
            break;
        }
        case 'obr_pregled': {
            route_obr_pregled('byorgpg');
            break;
        }
        case 'rpt_pregled': {
            router.navigate(['/rpt_pregled']);
            break;
        }
        default: {
            //statements; 
            break;
        }
    }
}
