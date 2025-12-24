import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { catchError, map, Observable, of, Subject, switchMap } from "rxjs";

import { RestDataSource } from "../../shared/rest.datasource";
import { UserSessionService } from '../../core-services/user-session.service';
import { LoaderService } from "../../core-services/loader.service";
import { HttpCoreService } from "../../core-services/http-core.service";
import { EvidDnStatus } from "../../model/evid-dnstatus.model";
import { EvidMultiNotification } from "../../model/evid-multi-notification.model";
import { EvidNotification } from "../../model/evid-notification.model";


@Injectable({
    providedIn: 'root'
})
export class EvidNotificationService {

    private _notifContent = new Subject<string>();
    private _notifList = new Subject<EvidNotification[]>();
    constructor(
        public userSessionService: UserSessionService,
        private httpCoreService: HttpCoreService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        let _sptype: string = "notification/multi/ext";

        return this.httpCoreService.getData<EvidNotification[]>(`${this.httpCoreService.baseUrl}${_sptype}?pOrgRole=true`).pipe(
            switchMap((value: EvidNotification[]) => {
                return of(value)
            })
        );
    }

    notifContent(): Observable<string> {
        return this._notifContent as Observable<string>;
    }

    notifList(): Observable<EvidNotification[]> {
        return this._notifList as Observable<EvidNotification[]>;
    }

    getNotification(_pId: number) {
        let _sptype: string = "notification/multi";;

        this.httpCoreService.getData<EvidMultiNotification>(`${this.httpCoreService.baseUrl}${_sptype}?pId=${_pId}`).subscribe({
            next: (value: EvidMultiNotification) => {
                this._notifContent.next(value.Content ?? "");
            },
            error: (err) => {
                console.error('Error getting notification data', err);
                this._notifContent.next("Error...");
            }
        });

    }

    getNotificationList() {
        let _sptype: string = "notification/multi/ext";;

        this.httpCoreService.getData<EvidNotification[]>(`${this.httpCoreService.baseUrl}${_sptype}?pOrgRole=true`).subscribe({
            next: (value: EvidNotification[]) => {
                console.log(`notification-service... sendNotifContent (3)... ${JSON.stringify(value)}`);
                this.setNotifList(value);
            },
            error: (err) => {
                console.error('Error getting notification data', err);
                this._notifContent.next("Error...");
            }
        });

    }

    setNotifList(__notifList: EvidNotification[]) {
        this._notifList.next(__notifList);  
    }

    delNotification(_pId: number) {
        let _sptype: string = "notification/multi";

        let _dummyBody = {
            id: _pId
          };
        this.httpCoreService.delData(`${this.httpCoreService.baseUrl}${_sptype}?pId=${_pId}`, _dummyBody).subscribe({
            next: (value: boolean) => {
                this.getNotificationList();
            },
            error: (err) => {
                console.error('Error deleting notification data', err);
                this._notifContent.next("Error...");
            }
        });

    }

    sendNotification(_pContent: string) {
        let _sptype: string = "notification/multi";

        let _Body = {
            Content: _pContent
          };
        this.httpCoreService.postData<boolean>(`${this.httpCoreService.baseUrl}${_sptype}?pOrgRole=true`, _Body).subscribe({
            next: (value: boolean) => {
                console.log(`notification-service... sendNotifContent (2)... ${JSON.stringify(value)}`);
                this.getNotificationList();
            },
            error: (err) => {
                console.error('Error deleting notification data', err);
                this._notifContent.next("Error...");
            }
        });

    }    
}
