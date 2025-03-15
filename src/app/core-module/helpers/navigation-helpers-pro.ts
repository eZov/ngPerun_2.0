import { Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';
import { LoaderService } from '../services/loader.service';

export function selectPro(
    linkId: string,
    router: Router,
    userSessionService: UserSessionService,
    loaderService: LoaderService,
    route_prip_pregled: (param: string) => void,
    route_obr_pregled: (param: string) => void
): void {
    switch (linkId) {
        case 'prip_putninalog_my': {
            loaderService.display(true);
            userSessionService.apiList = userSessionService.user.empId;
            router.navigate(['/pro_priprema_my', userSessionService.apiDays, 'priprema,akontacija']);
            break;
        }
        case 'prip_putninalog_org': {
            loaderService.display(true);
            userSessionService.apiList = -1;
            router.navigate(['/pro_priprema_org', 'byorgpg', userSessionService.apiDays, 'priprema,akontacija']);
            break;
        }
        case 'prip_putninalog_proforma': {
            loaderService.display(true);
            router.navigate(['/pro_priprema_proforma', userSessionService.apiDays, 'pripremaPF,akontacijaPF']);
            break;
        }
        case 'prip_putninalog_ext': {
            loaderService.display(true);
            router.navigate(['/pro_priprema_ext', userSessionService.apiDays, 'priprema,akontacija']);
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
        case 'ot_putninalog_my': {
            loaderService.display(true);
            userSessionService.apiList = userSessionService.user.empId;
            router.navigate(['/pro_otvoreni_my', userSessionService.apiDays, 'otvoren,odobren']);
            break;
        }
        case 'ot_putninalog_org': {
            loaderService.display(true);
            userSessionService.apiList = -1;
            router.navigate(['/pro_otvoreni_org', 'byorgpg', userSessionService.apiDays, 'otvoren,odobren']);
            break;
        }
        case 'ot_putninalog_proforma': {
            loaderService.display(true);
            userSessionService.apiList = -1;
            router.navigate(['/pro_otvoreni_proforma', 'byorgpg', userSessionService.apiDays, 'otvorenPF,odobrenPF']);
            break;
        }
        case 'gp_priprema_my': {
            router.navigate(['/gp_priprema_my']);
            break;
        }
        case 'gp_priprema': {
            router.navigate(['/gp_priprema']);
            break;
        }
        case 'gp_priprema_proforma': {
            router.navigate(['/gp_priprema_proforma']);
            break;
        }
        case 'gp_otvoren_my': {
            router.navigate(['/gp_otvoren_my']);
            break;
        }
        case 'gp_otvoren': {
            router.navigate(['/gp_otvoren']);
            break;
        }
        case 'gp_otvoren_proforma': {
            router.navigate(['/gp_otvoren_proforma']);
            break;
        }
        case 'gp_storno_my': {
            router.navigate(['/gp_storno_my']);
            break;
        }
        case 'gp_storno': {
            router.navigate(['/gp_storno']);
            break;
        }
        case 'gp_storno_proforma': {
            router.navigate(['/gp_storno_proforma']);
            break;
        }
        case 'st_putninalog_my': {
            loaderService.display(true);
            userSessionService.apiList = userSessionService.user.empId;
            router.navigate(['/sto_otvoreni_my', userSessionService.apiDays, 'odobren,storno']);
            break;
        }
        case 'st_putninalog_org': {
            loaderService.display(true);
            userSessionService.apiList = -1;
            router.navigate(['/sto_otvoreni_org', 'byorgpg', userSessionService.apiDays, 'odobren,storno']);
            break;
        }
        case 'st_putninalog_proforma': {
            loaderService.display(true);
            userSessionService.apiList = -1;
            router.navigate(['/sto_otvoreni_proforma', 'byorgpg', userSessionService.apiDays, 'odobrenPF,storno']);
            break;
        }
        case 'prip_pregled': {
            route_prip_pregled('byorgpg');
            break;
        }
        // case 'otvoreni': { 
        //     loaderService.display(true);                 
        //     router.navigate(['/otvoreni', usersession.apiDays, 'otvoren,odobren']);
        //    break; 
        // }             
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
