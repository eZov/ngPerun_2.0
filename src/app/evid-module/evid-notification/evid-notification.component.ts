import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserSessionService } from '../../core-services/user-session.service';
import { LoaderService } from '../../core-services/loader.service';
import { CalendarComponent, CalendarView, DatePickerComponent } from '@syncfusion/ej2-angular-calendars';
import {
  GridComponent, EditSettingsModel, QueryCellInfoEventArgs, SelectionSettingsModel,
  RowSelectEventArgs, RowDeselectEventArgs, ReturnType, GridLine
} from '@syncfusion/ej2-angular-grids';
import { TextBoxComponent, TextAreaComponent } from '@syncfusion/ej2-angular-inputs';

import { EvidCalendarService } from '../services/evid-calendar.service';
import { Subscription } from 'rxjs';
import { EvidProcesService } from '../services/evid-proces.service';
import { EvidText } from '../evid-text';
import { AppRole } from '../../app-roles';
import { EvidNotificationService } from '../services/evid-notification.service';
import { EvidNotification } from '../../model/evid-notification.model';


@Component({
  selector: 'nga-evid-notification',
  templateUrl: './evid-notification.component.html',
  styleUrls: ['./evid-notification.component.css']
})
export class EvidNotificationComponent implements OnInit {
  private subs: Subscription[] = [];

  showLoader!: boolean;
  public compTitle: string = "Obavještavanje korisnika";

  // GRID
  @ViewChild('grid', { static: false })
  public grid!: GridComponent;


  // DatePicker
  @ViewChild("datePicker", { static: false })
  public dp!: DatePickerComponent;

  public start: CalendarView = "Year";
  public depth: CalendarView = "Year";
  public format: string = "MM.yyyy";
  // ////////////////////////////////////////////////////////////

  // Grid

  @ViewChild('gridcal', { static: false }) gridcal!: GridComponent;
  public customAttributes!: Object;
  // ////////////////////////////////////////////////////////////

  public notificationList: EvidNotification[] = new Array<EvidNotification>();
  public notifContent: string = "";
  private contentId: number = 0;

  public evidText = EvidText;
  public txtPoruka: string;

  constructor(
    public userSessionService: UserSessionService,
    private loaderService: LoaderService,
    public eCalendarService: EvidCalendarService,
    public evidProcesService: EvidProcesService,
    private notificationService: EvidNotificationService,
    private route: ActivatedRoute
  ) {
    this.txtPoruka = EvidText.Notification2;
    this.showLoader = false;

    // Grid
    this.customAttributes = { class: 'customcss' };
    const selectionSettings: SelectionSettingsModel = { type: 'Single' };
    const editSettings: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true };
    const gridLine: GridLine = 'Both';
  }

  ngOnInit() {

    // SUBSCRIPTIONS /////////////////////////////////////////////////////////
    const sub1 = this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
    this.subs.push(sub1);

    // Tekst poruke
    const sub2 = this.notificationService.notifContent().subscribe((val: string) => {
      this.notifContent = val;
      console.log(`evid-notification.component 1: ${this.notifContent}`);
    });
    this.subs.push(sub2);

    // Lista obavjestenja svih korisnika
    const sub3 = this.notificationService.notifList().subscribe((val: EvidNotification[]) => {
      this.grid.dataSource = val;
      console.log(`evid-notification.component 2: ${JSON.stringify(val)}`);

      // Uzima id obavještenja, te od servera trži tekst poruke
      if(val[0] != undefined){
        console.log(`evid-notification.component 3: ${JSON.stringify(val[0])}`);
        this.contentId = val[0].ContentId ?? 0;
        this.notificationService.getNotification(this.contentId);
      } else{
        this.notifContent = "";
      }

      this.grid.refresh();
    });
    this.subs.push(sub3);

    this.loaderService.display(false);

  }

  ngAfterViewInit() {
    this.notificationService.setNotifList(this.route.snapshot.data['ntfcnlist']);
  }

  // METHODS /////////////////////////////////////////////////////////////////////////

  public refreshGrid() {

  }

  public delNotifContent() {
    console.log(`evid-notification... delNotifContent`);
    this.notificationService.delNotification(this.contentId);
  }

  public sendNotifContent() {
    console.log(`evid-notification... sendNotifContent (1)... ${this.txtPoruka}`);
    this.notificationService.sendNotification(this.txtPoruka);
  }
  // EVENTS /////////////////////////////////////////////////////////////////////////



  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    console.log(`evid-notification-ngOnDestroy...`);
  }
}
