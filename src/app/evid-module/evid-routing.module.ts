import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvidCalendarComponent } from './evid-calendar/evid-calendar.component';
import { SfrEvidPrisService } from '../shared/sfrevidpris.service';
import { EvidCalendarService } from './services/evid-calendar.service';
import { EvidGodOdmService } from './services/evid-god-odm.service';
import { EmployeeDataService } from '../shared/employeedata.service';
import { EvidDnevnikService } from './services/evid-dnevnik.service';
import { EvidDnevnik2Component } from './evid-dnevnik2/evid-dnevnik2.component';
import { EvidEmployeeService } from './services/evid-employee.service';
import { EvidKontrolaComponent } from './evid-kontrola/evid-kontrola.component';
import { EvidDnStatusService } from './services/evid-dn-status.service';
import { EvidNotificationComponent } from './evid-notification/evid-notification.component';
import { EvidNotificationService } from './services/evid-notification.service';


const routes: Routes = [
  {
    path: "evid_calendar",
    component: EvidCalendarComponent,
    resolve: {
      evidsifra: SfrEvidPrisService,
      evidcalendar: EvidCalendarService,
      evidgododm: EvidGodOdmService,
      evidemp: EvidEmployeeService
    },
  },
  {
    path: "evid_calendar/:empid/:mm/:yyyy",
    component: EvidCalendarComponent,
    resolve: {
      evidsifra: SfrEvidPrisService,
      evidcalendar: EvidCalendarService,
      evidgododm: EvidGodOdmService,
      employee: EmployeeDataService,
      evidemp: EvidEmployeeService
    },
  },
  {
    path: "evid_dnevnik2",
    component: EvidDnevnik2Component,
    resolve: {
      evidsifra: SfrEvidPrisService,
      eviddnevnik: EvidDnevnikService,
      evidgododm: EvidGodOdmService,
      evidemp: EvidEmployeeService
    },
  },
  {
    path: "evid_dnevnik2/:mm/:yyyy",
    component: EvidDnevnik2Component,
    resolve: {
      evidsifra: SfrEvidPrisService,
      eviddnevnik: EvidDnevnikService,
      evidgododm: EvidGodOdmService,
      evidemp: EvidEmployeeService
    },
  },
  {
    path: "evid_dnevnik2/:empid/:mm/:yyyy",
    component: EvidDnevnik2Component,
    resolve: {
      evidsifra: SfrEvidPrisService,
      eviddnevnik: EvidDnevnikService,
      evidgododm: EvidGodOdmService,
      evidemp: EvidEmployeeService
      //employee: EmployeeDataService
    },
  },
  {
    path: "evid_kontrola",
    component: EvidKontrolaComponent,
    resolve: {
      evidsifra: SfrEvidPrisService,
      eviddnstatus: EvidDnStatusService,
    },
  },
  {
    path: "evid_notification",
    component: EvidNotificationComponent,
    resolve: {
      ntfcnlist: EvidNotificationService,
      eviddnstatus: EvidDnStatusService,
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvidRoutingModule { }
