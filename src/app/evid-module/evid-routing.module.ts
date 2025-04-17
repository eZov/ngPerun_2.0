import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvidCalendarComponent } from './evid-calendar/evid-calendar.component';
import { SfrEvidPrisService } from '../shared/sfrevidpris.service';
import { EvidCalendarService } from './services/evid-calendar.service';
import { EvidGodOdmService } from './services/evid-god-odm.service';
import { EmployeeDataService } from '../shared/employeedata.service';
import { EvidDnevnikService } from './services/evid-dnevnik.service';


const routes: Routes = [
  {
    path: "evid_calendar",
    component: EvidCalendarComponent,
    resolve: {
      evidsifra: SfrEvidPrisService,
      eviddnevnik: EvidDnevnikService,
      evidcalendar: EvidCalendarService,
      evidgododm: EvidGodOdmService,
    },
  },
  {
    path: "evid_calendar/:empid/:mm/:yyyy",
    component: EvidCalendarComponent,
    resolve: {
      evidsifra: SfrEvidPrisService,
      //eviddnevnik: EvidDnevnikService,
      evidcalendar: EvidCalendarService,
      evidgododm: EvidGodOdmService,
      employee: EmployeeDataService,
    },
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvidRoutingModule {}
