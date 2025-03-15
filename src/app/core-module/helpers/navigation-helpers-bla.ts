import { Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';

export function selectBla(
    linkId: string,
    router: Router,
    userSessionService: UserSessionService,
    route_prip_pregled: (param: string) => void,
    route_obr_pregled: (param: string) => void
): void {
    switch (linkId) {
        case 'ispl_akontacija': {
            router.navigate(['/ispl_akontacija', userSessionService.apiDays, 'odobren,aktivan']);
            break;
        }
        case 'ispl_pravdanje': {
            router.navigate(['/ispl_pravdanje', userSessionService.apiDays, 'obracunfin,obracunat,opravdan']);
            break;
        }
        case 'gp_pravdanje': {
            router.navigate(['/gp_pravdanje']);
            break;
        }
        case 'ost_putninalog_org': {
            userSessionService.apiList = -1;
            router.navigate(['/ost_putninalog_org', 'byorgpg', userSessionService.apiDays, 'odobren, aktivan, obracunat, opravdan']);
            break;
        }
        default: {
            //statements; 
            break;
        }
    }
}
