import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EnvServiceProvider } from './env.service.provider';
// import { environment } from 'src/environments/environment';
// import { EnvService } from 'src/app/env.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'ngx-moment'; // optional, provides moment-style pipes for date formatting
import { ModalModule } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { WINDOW_PROVIDERS } from './window.providers';
import { LocationService } from './core-module/services/location.service';

import { AuthGuardService } from './shared/auth-guard.service';
import { RoleGuardService } from './shared/role-guard.service';
import { AuthService } from './core-module/services/auth.service';
import { EmployeeService } from './shared/employee.service';
//import { RestDataSource, REST_URL } from './shared/rest.datasource';
import { RestDataSource } from './shared/rest.datasource';
import { LoaderService } from './core-module/services/loader.service';

import { EvidDnevnikService } from './services/evid-dnevnik.service';

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



import { AktivnostService } from './shared/aktivnost.service';

import { EmployeeRecService } from './shared/employeerec.service';
import { OpcinaService } from './shared/opcina.service';
import { OrganizacijaService } from './shared/organizacija.service';
import { EmployeeExtService } from './shared/employeeext.service';
import { SfrEvidPrisService } from './shared/sfrevidpris.service';

import { CoreModule } from './core-module/core.module';


@NgModule({
  declarations: [
    AppComponent,    
  ],
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
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
    MatDialogModule, MatFormFieldModule, MatInputModule, MatCardModule, MatExpansionModule,
    MatProgressSpinnerModule, MatSelectModule, MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    GridAllModule,
    DatePickerModule, MultiSelectModule, ComboBoxModule,DateRangePickerModule,
    ToolbarModule, TreeViewModule, TabAllModule,
    TextBoxModule, UploaderModule,
    AutoCompleteModule, MenuModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    ModalModule.forRoot()
  ],
  providers: [
    EnvServiceProvider,
    RestDataSource,        
    AuthService, AuthGuardService, EmployeeService, EmployeeExtService, AktivnostService, 
    EmployeeRecService, OpcinaService, OrganizacijaService, SfrEvidPrisService,
    RoleGuardService, 
    LoaderService,
    EvidDnevnikService,
    PageService,
    SortService,
    FilterService,
    GroupService,
    SearchService,  
    CookieService, 
    WINDOW_PROVIDERS, LocationService ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// HACK https://www.npmjs.com/package/ngx-alerts