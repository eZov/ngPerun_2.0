import { Router } from '@angular/router';
import { UserSessionService } from '../user-session.service';

export function selectUpo(
    linkId: string,
    router: Router,
    userSessionService: UserSessionService,
    route_prip_pregled: (param: string) => void,
    route_obr_pregled: (param: string) => void
): void {
    switch (linkId) {
        case 'prip_putninalog': {
            router.navigate(['/pro_priprema', userSessionService.apiDays, 'priprema,akontacija,otvoren,odobren,aktivan']);
            break;
        }
        case 'prip_predlosci': {
            router.navigate(['/upo_aktivni', 'byemp']);
            break;
        }
        case 'obr_izvoputu': {
            router.navigate(['/obr_izvoputu', userSessionService.apiDays, 'aktivan,popunautoku,popunjen']);
            break;
        }
        case 'prip_pregled': {
            route_prip_pregled('byupo');
            break;
        }
        case 'obr_pregled': {
            route_obr_pregled('byupo');
            break;
        }
        case 'evid_dnevnik': {
            router.navigate(['/evid_dnevnik']);
            break;
        }
        case 'evid_dnevnik2': {
            router.navigate(['/home-not-developed/Dnevnik rada i odsustva']);
            break;
        }
        case 'evid/evid_calendar': {
            router.navigate(['evid/evid_calendar']);
            break;
        }
        case 'help_dnrada': {
            let pdffilename: string = "Perun-Dnevnik rada i odsustva.pdf";
            router.navigateByUrl('/pdfviewer/' + pdffilename);
            break;
        }
        case 'help_mperun': {
            let pdffilename: string = "mPerunHelp.pdf";
            router.navigateByUrl('/pdfviewer/' + pdffilename);
            break;
        }
        case 'epotpis1': {
            router.navigate(['/epotpis1']);
            break;
        }
        case 'epotpis2': {
            router.navigate(['/epotpis2']);
            break;
        }
        default: {
            break;
        }
    }
}
