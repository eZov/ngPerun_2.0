import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastAppComponent} from './toast/toast.component';
import { BrowserModule } from '@angular/platform-browser';
import { ToastService } from './toast.service';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';



@NgModule({
  declarations: [
    ToastAppComponent
  ],
  imports: [
    CommonModule, BrowserModule, ToastModule
  ],
  exports: [ToastAppComponent],
  providers: [ToastService]
})
export class ToastsModule { }
