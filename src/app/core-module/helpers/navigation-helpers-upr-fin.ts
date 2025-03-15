import { Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';

export function selectUprFin(
    linkId: string,
    router: Router,
    userSessionService: UserSessionService,
    route_prip_pregled: (param: string) => void,
    route_obr_pregled: (param: string) => void
): void {
    switch (linkId) {
        case 'obr_obracun': {
            router.navigate(['/obr_obracun', userSessionService.apiDays, 'obracunutoku,obracunat']);
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
        default: {
            //statements; 
            break;
        }
    }
}
