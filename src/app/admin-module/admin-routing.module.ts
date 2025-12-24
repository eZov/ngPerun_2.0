import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmOrganizacijaComponent } from './adm-organizacija/adm-organizacija.component';
import { ClientDataComponent } from './client-data/client-data.component';
import { OrgListService } from '../services/org-list.service';
import { OrgPGListService } from '../services/orgpg-list.service';
import { AdmEmployee } from '../model/adm-employees.model';
import { AdmEmployeesComponent } from './adm-employees/adm-employees.component';
import { AdmUsersComponent } from './adm-users/adm-users.component';
import { AdmEmployeesTableService } from '../services/adm-employees-table.service';
import { AdmUsersRolesComponent } from './adm-users-roles/adm-users-roles.component';
import { AdmUsersOrgRolesComponent } from './adm-users-orgroles/adm-users-orgroles.component';
const routes: Routes = [
  {
    path: 'org_organizacija',
    component: AdmOrganizacijaComponent,
    resolve: {
        orgList: OrgListService
      },
  },
  {
    path: 'emp_employees',
    component: AdmEmployeesComponent,
    resolve: {
        orgList: OrgListService
      },
  },  
  {
    path: 'emp_users',
    component: AdmUsersComponent,
    resolve: {
      //admEmployeesTable: AdmEmployeesTableService, // nepotrebno, proziva uposlenike usere
      orgList: OrgListService,
      //orgListpg: OrgPGListService,
      },
  },
  {
    path: 'emp_users-roles',
    component: AdmUsersRolesComponent,
    resolve: {
      //admEmployeesTable: AdmEmployeesTableService, // nepotrebno, proziva uposlenike usere
      orgList: OrgListService,
      //orgListpg: OrgPGListService,
      },
  },        
  {
    path: 'emp_users-orgroles',
    component: AdmUsersOrgRolesComponent,
    resolve: {
      //admEmployeesTable: AdmEmployeesTableService, // nepotrebno, proziva uposlenike usere
      orgList: OrgListService,
      //orgListpg: OrgPGListService,
      },
  },     
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
