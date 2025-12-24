import { Router } from '@angular/router';
import { UserSessionService } from '../user-session.service';

export function selectAdm(
    linkId: string,
    router: Router,
    userSessionService: UserSessionService,
    route_prip_pregled: (param: string) => void,
    route_obr_pregled: (param: string) => void
): void {
    switch (linkId) {
        case 'admin/emp_users': {
            router.navigate(['admin/emp_users']);
            break;
        }
        case 'admin/emp_users-roles': {
            router.navigate(['admin/emp_users-roles']);
            break;
        }  
        case 'admin/emp_users-orgroles': {
            router.navigate(['admin/emp_users-orgroles']);
            break;
        }               
        case 'adm_orgrole': {
            router.navigate(['/adm_orgrole']);
            break;
        }
        case 'adm_role1': {
            router.navigate(['/adm_role1']);
            break;
        }
        case 'adm_role2': {
            router.navigate(['/adm_role2']);
            break;
        }
        case 'adm_epotpisi': {
            router.navigate(['/adm_epotpisi']);
            break;
        }
        case 'adm_parametri': {
            router.navigate(['/adm_parametri']);
            break;
        }
        case 'adm_protokol': {
            // console.log("selectAdm: ",linkId);
            router.navigate(['/adm_protokol']);
            break;
        }
        case 'adm_protokol2': {
            // console.log("selectAdm: ",linkId);
            router.navigate(['/adm_protokol2']);
            break;
        }
        case 'adm_rbputnal': {
            router.navigate(['/adm_rbputnal']);
            break;
        }
        case 'emp_personalinfo': {
            router.navigate(['/emp_personalinfo']);
            break;
        }
        case 'emp_personalinfo2': {
            router.navigate(['/emp_personalinfo2']);
            break;
        }
        case 'emp_personalinfo3': {
            router.navigate(['/emp_personalinfo3']);
            break;
        }
        case 'admin/org_organizacija': {
            router.navigate(['admin/org_organizacija']);
            break;
        }
        case 'admin/emp_employees': {
            router.navigate(['admin/emp_employees']);
            break;
        }        
        default: {
            //statements; 
            break;
        }
    }
}
