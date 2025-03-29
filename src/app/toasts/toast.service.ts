import { Injectable } from '@angular/core';
import { Toast, ToastModel } from '@syncfusion/ej2-notifications'; // Import the toast component
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ToastApp } from './toast.model';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    public toastInstance!: Toast;
    constructor() { }

      toasts: Observable<ToastApp> = new ReplaySubject<ToastApp>(1);
    
      reportToast(tst: ToastApp | undefined) {
          (this.toasts as Subject<ToastApp | undefined>).next(tst);
      }  
      
    // To create the toast component
    createToast: Function = (element: HTMLElement, model: ToastModel): Toast => {
        if (!element.classList.contains('e-toast')) {
            this.toastInstance = new Toast(model, element);
        }
        this.toastInstance.timeOut = 3000;
        return this.toastInstance
    };

    // To show the toast component
    showToast: Function = (element: HTMLElement, model: ToastModel) => {
        this.toastInstance = this.createToast(element, model);
        this.toastInstance.show();
    }

    // To hide the toast component
    hideToast: Function = () => {
        if (this.toastInstance) {
            this.toastInstance.hide();
        }
    }

    // To hide the all toast component
    hideToastAll: Function = () => {
        if (this.toastInstance) {
            this.toastInstance.hide('All');
        }
    }
}

