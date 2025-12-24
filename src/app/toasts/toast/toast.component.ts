import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastComponent, ToastPositionModel, ToastModel } from '@syncfusion/ej2-angular-notifications';
import { closest} from '@syncfusion/ej2-base';
import { ToastService } from '../toast.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../core-services/notification.service';

@Component({
    selector: 'paToasts',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css']
})
export class ToastAppComponent implements OnInit {
    private subs: Subscription[] = [];

    @ViewChild('myModal', { static: false }) modal!: ElementRef;

    @ViewChild('toasttype')
    private toastObj!: ToastComponent;

    public position: ToastPositionModel = { X: 'Center' };
    //public buttons = [{ model: { content: "Ignore" }, click: this.btnToastClick.bind(this)}, {model: { content: "reply" }}];
    public buttons = [];

    private notificationId?: number

    // Link to the Syncfusion documentation for the Toast component
    // https://ej2.syncfusion.com/angular/demos/#/bootstrap5/toast/types

    // public toasts: { [key: string]: Object }[] = [
    //     { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    //     { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    //     { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    //     { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
    // ];

    constructor(
        public toastService: ToastService,
        public notificationService: NotificationService
    ) {
        const sub1 = toastService.toasts.subscribe(tst => {
            const tstApp = tst as ToastModel;
           this.notificationId = tst.notificationId;

            if(tst.showButtons){
                tstApp.buttons =  [{ model: { content: "Zatvori" }, click: this.btnZatvoriClick.bind(this)}]
            }

            this.open();
            this.openToast(tstApp);
            console.log('toast.component-subscribe...');
        });
        this.subs.push(sub1);
        console.log('toast.component-constructor...');
    }

    ngOnInit(): void { }

    btnZatvoriClick(e: any) {
        const toastEle = closest(e.target, '.e-toast');
        this.toastObj.hide(toastEle);
         console.log('toast.component-ZATVORI...'+JSON.stringify(e));
        if(this.notificationId !== undefined)
            this.notificationService.setReadNotification(this.notificationId);  
      }

    openToast(tst: ToastModel | undefined) {
        this.toastObj.show(tst);
    }

    public onCreate(): void {
        // setTimeout(function () {
        //     this.toastObj.show(this.toasts[3]);
        // }.bind(this), 200);
    }

    public onclose(e: any): void {
        // if (e.toastContainer.childElementCount === 0) {
        //     this.hidebtn.element.style.display = 'none';
        // }
    }

    public onBeforeOpen(): void {

    }

    open() {
        this.modal.nativeElement.style.display = 'block';
    }

    close() {
        this.modal.nativeElement.style.display = 'none';
    }

    ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
        console.log('toast.component-ngOnDestroy...');
    }
}
