import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { ToastComponent, ToastCloseArgs, ToastPositionModel, ToastModule, ToastModel } from '@syncfusion/ej2-angular-notifications';
import { ToastService } from '../toast.service';
import { Subscription } from 'rxjs';
import { ToastApp } from '../toast.model';

@Component({
    selector: 'paToasts',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css']
})
export class ToastAppComponent implements OnInit {
    private subs: Subscription[] = [];

    @ViewChild('toasttype')
    private toastObj!: ToastComponent;

    public position: ToastPositionModel = { X: 'Center' };

    // Link to the Syncfusion documentation for the Toast component
    // https://ej2.syncfusion.com/angular/demos/#/bootstrap5/toast/types

    public toasts: { [key: string]: Object }[] = [
        { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
        { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
        { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
        { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
    ];

    constructor(
        public toastService: ToastService,
        public router: Router
    ) {
        const sub1 = toastService.toasts.subscribe(tst => {
            const tstApp = tst as ToastModel;
            // tstApp.width = '35%';
            // tstApp.height = '5%';
            this.open(tstApp);

        });
        this.subs.push(sub1);

    }

    ngOnInit(): void { }

    open(tst: ToastModel | undefined) {
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
        // this.hidebtn.element.style.display = 'inline-block';
    }

    ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }
}
