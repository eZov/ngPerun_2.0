import { Injectable } from '@angular/core';
import { HttpCoreService } from './http-core.service';
import { ToastService } from '../toasts/toast.service';
import { ToastApp } from '../toasts/toast.model';
import { EvidNotification } from '../model/evid-notification.model';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private toastApp!: ToastApp;

    constructor(
        private httpCoreService: HttpCoreService,
        private toastService: ToastService,
    ) {

    }

    getNotification(notificationId: number): void {

        let _sptype: string = "notification/receiver";
        this.httpCoreService.getData<EvidNotification>(`${this.httpCoreService.baseUrl}${_sptype}?`).subscribe({
            next: (value: EvidNotification) => {
                this.toastApp = {
                    title: 'Obavještenje',
                    content: value.Content?? "",
                    cssClass: 'e-toast-warning',
                    icon: 'e-warning toast-icons',
                    notificationId: value.Id,
                };
                console.log(`toast.component-GET... ${JSON.stringify(value)}`);
                if(!value.IsRead) {
                this.toastService.reportButtonToast(this.toastApp);
                };
            },
            error: (error) => {
                console.error('Error fetching notifications', error);
            }
        });

    }

    setReadNotification(notificationId: number): void {
        let _sptype: string = "notification";

        let _data: EvidNotification = {
            Id: notificationId,
            IsRead: true,
        };
        this.httpCoreService.putData<boolean>(`${this.httpCoreService.baseUrl}${_sptype}?pid=${notificationId}`, _data).subscribe({
            next: (value: boolean) => {
                console.log(`toast.component-ZATVORI UPISANO U BAZU...${JSON.stringify(notificationId)} ${JSON.stringify(value)}`);
            },
            error: (error) => {
                console.error('Error fetching notifications', error);
            }
        });

    }

}