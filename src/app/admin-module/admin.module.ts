import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DetailRowService, EditService, FilterService, GroupService, PageService, SortService, ToolbarService, 
  GridModule } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule, TreeViewModule, TabAllModule, MenuModule, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { CheckBoxModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ToastModule, ToastUtility } from '@syncfusion/ej2-angular-notifications';

import { AdmOrganizacijaComponent } from './adm-organizacija/adm-organizacija.component';
import { ClientDataComponent } from './client-data/client-data.component';
import { OrgjedService } from './services/orgjed.service';
import { ActivatedRoute } from '@angular/router';
import { OrgJed } from '../model/orgjed.model';
import { LoaderService } from '../core-services/loader.service';
import { AdminRoutingModule } from './admin-routing.module';
import { OrgJedListService } from './services/orgjed-list.service';
import { AdmEmployeesComponent } from './adm-employees/adm-employees.component';
import { EmployeeDataComponent } from './employee-data/employee-data.component';
import { EmployeesDataComponent } from './employees-data/employees-data.component';
import { EmployeesService } from './services/employees.service';
import { EmployeeService } from './services/employee.service';
import { AdmUsersComponent } from './adm-users/adm-users.component';

// import { AdmEmployeesComponent } from './adm-employees/adm-employees.component';
// import { AdmEpotpisiComponent } from './adm-epotpisi/adm-epotpisi.component';
// import { AdminComponent } from './admin/admin.component';
// import { AdmPasswordComponent } from './adm-password/adm-password.component';
// import { AdmRole1Component } from './adm-role1/adm-role1.component';
// import { AdmRole2Component } from './adm-role2/adm-role2.component';


@NgModule({
  declarations: [
    ClientDataComponent, AdmOrganizacijaComponent, AdmEmployeesComponent, 
    EmployeeDataComponent, EmployeesDataComponent, AdmUsersComponent
  ],
  imports: [
    CommonModule,
    SidebarModule, SplitterModule, 
    GridModule, ToolbarModule, TreeViewModule, 
    TabAllModule, MenuModule, DropDownListAllModule, DatePickerModule, 
    DateTimePickerModule, UploaderModule, CheckBoxModule, ButtonModule,
    ToastModule, 
    CommonModule, ReactiveFormsModule, FormsModule, 
    MatProgressSpinnerModule,
    AdminRoutingModule
  ],
  exports: [
    AdmOrganizacijaComponent, AdmEmployeesComponent, AdmUsersComponent
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    EditService,
    ToolbarService,
    DetailRowService,
    OrgjedService, OrgJedListService, EmployeesService, EmployeeService
  ]
})
export class AdminModule { }