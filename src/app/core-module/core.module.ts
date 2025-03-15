import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'ngx-moment'; // optional, provides moment-style pipes for date formatting
import { CookieService } from 'ngx-cookie-service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';



import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule, TreeViewModule, TabAllModule, MenuModule, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { DatePickerModule, DateRangePickerModule, CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListAllModule, MultiSelectModule, ComboBoxModule, AutoCompleteModule, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, SwitchModule, ChipListModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { GridAllModule, GridModule, PageService, SortService, FilterService, GroupService, 
  SearchService, PagerModule } from '@syncfusion/ej2-angular-grids';
import { TooltipModule, DialogModule  } from '@syncfusion/ej2-angular-popups';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';

import { HomeComponent }  from './components/home/home.component';
import { FooterComponent }  from './components/footer/footer.component';
// import { NavbarComponent } from './components//navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { Routes, RouterModule } from "@angular/router";
import { NotFoundComponent } from './components/notFound.component';
import { NotDevelopedComponent } from './components/notDeveloped.component';



@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    // NavbarComponent,
    LoginComponent,
    MenubarComponent,
    NotFoundComponent, 
    NotDevelopedComponent         
  ],
  exports: [
    HomeComponent,
    FooterComponent,
    // NavbarComponent,
    LoginComponent,
    MenubarComponent,
    NotFoundComponent, 
    NotDevelopedComponent              
  ],  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    DropDownListModule,
    ButtonModule,
    SwitchModule, ChipListModule, CheckBoxModule,
    RichTextEditorAllModule,
    GridModule,
    PagerModule,      
    TooltipModule,
    DialogModule,
    SidebarModule, CalendarModule,ToastModule,
    BrowserAnimationsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatExpansionModule,
    MatProgressSpinnerModule, MatSelectModule, MatToolbarModule,
    GridAllModule,
    DatePickerModule, MultiSelectModule, ComboBoxModule,DateRangePickerModule,
    ToolbarModule, TreeViewModule, TabAllModule,
    TextBoxModule, UploaderModule,
    AutoCompleteModule, MenuModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    RouterModule
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    SearchService,  
    CookieService
  ]
})
export class CoreModule { }
