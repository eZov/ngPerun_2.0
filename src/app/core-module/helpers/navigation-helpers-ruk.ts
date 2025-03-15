import { Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';

export function selectRuk(
    linkId: string,
    router: Router,
    userSessionService: UserSessionService,
    route_prip_pregled: (param: string) => void,
    route_obr_pregled: (param: string) => void
): void {
    switch (linkId) {
        case 'prip_putninalog': {
            router.navigate(['/pro_priprema', userSessionService.apiDays, 'priprema,akontacija']);
            break;
        }
        case 'prip_predlosci': {
            router.navigate(['/upo_priprema', 'bypg']);
            break;
        }
        case 'odob_epotpis1': {
            router.navigate(['/potpis1', userSessionService.apiDays, 'otvoren,odobren']);
            break;
        }
        case 'odob_epotpis2': {
            router.navigate(['/potpis2', userSessionService.apiDays, 'obracunfin,obracunat']);
            break;
        }
        case 'odob_key': {
            router.navigate(['/key']);
            break;
        }
        case 'obr_izvoputu': {
            router.navigate(['/obr_izvoputu', userSessionService.apiDays, 'aktivan,popunautoku,popunjen']);
            break;
        }
        case 'obr_provjera': {
            //router.navigate(['/obr_provjera', usersession.apiDays, sptableapi.getPNUrlStatus_ByFlow(linkId, 'rukovodilac')]);
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
        case 'epotpis2': {
            // loaderService.display(true);                
            router.navigate(['/epotpis2']);
            break;
        }
        default: {
            //statements; 
            break;
        }
    }
}
