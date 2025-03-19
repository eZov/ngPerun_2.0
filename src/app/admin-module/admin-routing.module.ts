import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmOrganizacijaComponent } from './adm-organizacija/adm-organizacija.component';
import { ClientDataComponent } from './client-data/client-data.component';
import { OrgListService } from '../services/org-list.service';
import { OrgPGListService } from '../services/orgpg-list.service';
import { AdmEmployee } from '../model/adm-employees.model';
import { AdmEmployeesComponent } from './adm-employees/adm-employees.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
