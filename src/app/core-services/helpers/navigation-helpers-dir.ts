import { Router } from '@angular/router';
import { UserSessionService } from '../user-session.service';

export function selectDir(
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
            router.navigate(['/upo_aktivni', 'byemp']);
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
