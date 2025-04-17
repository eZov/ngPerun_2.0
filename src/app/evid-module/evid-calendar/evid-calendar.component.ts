import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserSessionService } from '../../core-services/user-session.service';
import { LoaderService } from '../../core-services/loader.service';
import { EvidDnevnikService } from '../services/evid-dnevnik.service';
import { CalendarComponent, CalendarView } from '@syncfusion/ej2-angular-calendars';
import { EvidDnevnik } from '../../model/evid-dnevnik.model';
import { EvidSifra } from '../../model/evid-sifra.model';
import { EvidCalendar } from '../../model/evid-calendar.model';
// import { detachEmbeddedView } from '@angular/core/src/view';
import {
  GridComponent, EditSettingsModel, QueryCellInfoEventArgs, SelectionSettingsModel,
  RowSelectEventArgs, RowDeselectEventArgs, ReturnType, GridLine
} from '@syncfusion/ej2-angular-grids';
import { TimeListService } from '../../services/time-list.service';
// import { forEach } from '@angular/router/src/utils/collection';
import { EvidCalendarWeek } from '../../model/evid-calendar-week.model';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { ChangedEventArgs } from '@syncfusion/ej2-angular-inputs';
import { DateTimeJsService } from '../../services/date-time-js.service';
import { EvidGodOdm } from '../../model/evid-gododm.model';
import { EmployeeRec } from '../../model/employeerec.model';
import { EvidCalendarService } from '../services/evid-calendar.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'nga-evid-calendar',
  templateUrl: './evid-calendar.component.html',
  styleUrls: ['./evid-calendar.component.css']
})
export class EvidCalendarComponent implements OnInit {
  private subs: Subscription[] = [];


  @ViewChild('evdCal', { static: false })
  public evdCal!: CalendarComponent;


  showLoader!: boolean;


  public compTitle: string = "Kalendar rada i odsustva";

  public _empid!: number;
  public _MM!: number;
  public _YYYY!: number;

  public godOdm?: EvidGodOdm;


  public start: CalendarView = "Year";
  public depth: CalendarView = 'Year';
  public format: string = 'MMMM y';

  @ViewChild('gridsum')
  public grid!: GridComponent;
  public selectionOptions!: SelectionSettingsModel;
  public lines!: GridLine;

  @ViewChild('gridcal', { static: false }) gridcal!: GridComponent;
  public customAttributes!: Object;

  @ViewChild('butSend', { static: false })
  public butSend!: ButtonComponent;

  public SumSati = 0;
  public chkSuperLock: boolean = false;

  private role: string = '';

  constructor(
    public userSessionService: UserSessionService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    public eCalendarService: EvidCalendarService,
    private location: Location,
  ) {

    this.godOdm = new EvidGodOdm();
    this.godOdm.ycurr = 0;
    this.godOdm.ycurr_isk = 0;
    this.godOdm.ycurr_rjes = 0;
    this.godOdm.yprev_isk = 0;
    this.godOdm.yprev_rjes = 0;

  }

  ngOnInit() {


    const sub1 = this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
    this.subs.push(sub1);

    this._empid = this.route.snapshot.params["empid"];
    if (this._empid == null) {
      this._empid = this.userSessionService.user.empId;
    }

    const sub2 = this.eCalendarService.getGodOdm().subscribe(godOdmObs => {
      this.godOdm = godOdmObs;
    })
    this.subs.push(sub2);

    const sub3 = this.eCalendarService.getSumSati().subscribe(sumSatiObs => {
      this.SumSati = sumSatiObs;
    })
    this.subs.push(sub3);

    const sub4 = this.userSessionService.getUser().subscribe(user => {
      this.role = user.role;
      console.log("==(calendar)> login getUser: " + JSON.stringify(user));
    })
    this.subs.push(sub4);

    this.compTitle = this.role === 'uposlenik' ? "Kalendar rada i odsustva " : "Kontrola kalendara rada i odsustva za: ";

    this.eCalendarService.sfrevidprisData = this.route.snapshot.data['evidsifra'].map((el: any) => {
      el.itemType = + el.itemType;
      return el
    });


    this.eCalendarService.evidDnevnikData = this.route.snapshot.data['evidcalendar'];
    this.customAttributes = { class: 'customcss' };

    this.eCalendarService.sendDisableSet();

    let _dt = this.userSessionService.firstDate;

    this._MM = this.route.snapshot.params["mm"] != undefined ? +this.route.snapshot.params["mm"] : _dt.getMonth() + 1;
    this._YYYY = this.route.snapshot.params["yyyy"] != undefined ? +this.route.snapshot.params["yyyy"] : _dt.getFullYear();


    this.eCalendarService.setGodOdm(this.route.snapshot.data['evidgododm']);

    let _emp: EmployeeRec = this.route.snapshot.data['employee'];
    if (_emp != undefined) {
      this.compTitle = this.compTitle + " " + _emp.FirstName + " " + _emp.LastName
    }

    this.chkSuperLock = this.eCalendarService.chkSuperLock;

    this.loaderService.display(false);

  }

  ngAfterViewInit() {

    this.sendDisable();
    // Set grid datasource sa Šifre
    console.log("==(calendar)> grid.dataSource: " + JSON.stringify(this.eCalendarService.sfrevidprisData));
    this.grid.dataSource = this.eCalendarService.sfrevidprisData;

    this.gridcal.dataSource = this.eCalendarService.evidCalendarWeekData;
  }

  // METHODS /////////////////////////////////////////////////////////////////////////


  butClick(_day: number) {

    this.eCalendarService.evidDay(_day);

    this.gridsumRefresh();
    this.eCalendarService.saveButtOn = this.eCalendarService.sendButtOn === true ? true : false;
  }


  autoPopulate() {

    this.eCalendarService.autoPopulate();
    this.gridsumRefresh();
    this.eCalendarService.saveButtOn = this.eCalendarService.sendButtOn === true ? true : false;
  }

  autoDelete() {

    this.eCalendarService.autoDelete();
    this.gridsumRefresh();
    this.eCalendarService.saveButtOn = this.eCalendarService.sendButtOn === true ? true : false;
  }

  saveEvid() {

    this.loaderService.display(true);
    let _superlock: boolean = this.role === "sekretarica" ? true : false;

    const sub5 = this.eCalendarService.saveCalendarData(_superlock).subscribe({
      next: (result) => {
        if (result) {
          this.gridsumRefresh();
          this.eCalendarService.sendDisableSet();
          this.sendDisable();

          this.getGoStatus();
        }
        this.loaderService.display(false);
      }
      , error: (err) => {
        console.log(err);
        this.loaderService.display(false);
      }
    });
    this.subs.push(sub5);
  }

  evidDnevnikClick() {

    switch (this.butSend.content === 'Podnesi') {
      case true: {
        this.evidDnevnikSend();
        break;
      }

      case false: {
        this.evidDnevnikSend(false);
        break;
      }
    }
  }

  private evidDnevnikSend(sendFlag: boolean = true) {

    this.loaderService.display(true);

    const sub6 = this.eCalendarService.evidDnevnikSend(this._empid, this._MM, this._YYYY, sendFlag).subscribe({
      next: (result: boolean) => {
        if(result) {
          this.gridsumRefresh();

          this.eCalendarService.sendDisableSet();
          this.sendDisable();
  
          this.getGoStatus();
        }
        this.loaderService.display(false);
      },
      error: (err: any) => {
        console.log(err);
        this.loaderService.display(false);
      }
    });
    this.subs.push(sub6);
  }


  private sendDisable() {

    //HACK: eCalendarService.sendButtOn odredjuje da li je button Podnesi (sendButtOn=TRUE) ili Opozovi (sendButtOn=FALSE)
    switch (this.eCalendarService.sendButtOn) {
      case true: {
        this.butSend.cssClass = 'btn-block e-primary';
        this.butSend.iconCss = 'e-btn-sb-icon sf-icon-mail-all-wf';
        this.butSend.content = 'Podnesi';
        break;
      }

      case false: {
        this.butSend.cssClass = 'btn-block e-danger';
        this.butSend.iconCss = 'e-btn-sb-icon sf-icon-mail-delete-wf';
        this.butSend.content = 'Opozovi';
        break;
      }
    }

    this.eCalendarService.sendDisable();
    this.butSend.disabled = this.eCalendarService.disabledButton;
    this.eCalendarService.saveButtOn = false;

  }

  public getGoStatus() {

    const sub8 = this.eCalendarService.getGoStatus(this._empid, this._YYYY).subscribe({
      next: (result) => {
        this.loaderService.display(false);
      },
      error: (err) => {
        console.log(err);
        this.loaderService.display(false);
      }
    });
    this.subs.push(sub8);
  }

  public refreshGrid() {

    this.loaderService.display(true);

    const sub9 = this.eCalendarService.getCalendarData(this._empid, this._MM, this._YYYY)
      .subscribe({
        next: (result) => {
          if (result) {

            this.gridsumRefresh();
            this.eCalendarService.sendDisableSet();
            this.sendDisable();

            this.getGoStatus();
          }
          this.loaderService.display(false);

        },
        error: (err) => {
          console.log(err);
          this.loaderService.display(false);
        }
      });
    this.subs.push(sub9);



  }

  goBack() {
    this.location.back();
  }

  // EVENTS /////////////////////////////////////////////////////////////////////////


  customiseCell(args: QueryCellInfoEventArgs) {

    if (args.column?.field === 'itemtype') {

      if (args.data && (args.data as { sifra: string })['sifra'] === 'PLC') {
        args.cell?.classList.add('sfr-plc');
      } else if (args.data && (args.data as { sifra: string })['sifra'] === 'NPL') {
        args.cell?.classList.add('sfr-npl');
      } else if (args.data && 'sifra' in args.data && (args.data as { sifra: string })['sifra'] === 'BOL') {
        args.cell?.classList.add('sfr-bol');
      } else if (args.data && typeof args.data === 'object' && 'sifra' in args.data && args.data['sifra'] === 'POD') {
        args.cell?.classList.add('sfr-pod');
      } else if (args.data && typeof args.data === 'object' && 'sifra' in args.data && args.data['sifra'] === 'PRV') {
        args.cell?.classList.add('sfr-prv');
      } else if (args.data && typeof args.data === 'object' && 'sifra' in args.data && args.data['sifra'] === 'SND') {
        args.cell?.classList.add('sfr-snd');
      } else if (args.data && typeof args.data === 'object' && 'sifra' in args.data && args.data['sifra'] === 'SP') {
        args.cell?.classList.add('sfr-sp');
      } else if (args.data && typeof args.data === 'object' && 'sifra' in args.data && (args.data as { sifra: string })['sifra'].indexOf('GO') >= 0) {
        args.cell?.classList.add('sfr-go');
      } else if (args.data && typeof args.data === 'object' && 'sifra' in args.data && args.data['sifra'] === 'RRK') {
        args.cell?.classList.add('sfr-rrk');
      } else if (args.data && typeof args.data === 'object' && 'sifra' in args.data && args.data['sifra'] === 'RRD') {
        args.cell?.classList.add('sfr-rrd');
      } else {
        args.cell?.classList.add('sfr-none');
      }
    }
  }

  onCheckChange(args: any) {
    this.eCalendarService.selEvidSifra(args);

    console.log("onCheckChange 4: " + this.eCalendarService.sendButtOn);
  }

  changeDtPick(args: ChangedEventArgs) {

    if (args.value != null) {
      let _dt: Date = new Date(args.value);
      this._YYYY = _dt.getFullYear();
      this._MM = _dt.getMonth() + 1;

      this.refreshGrid();
    }
  }


  private gridsumRefresh() {
    this.grid.refresh();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    console.log('evid-calendar-ngOnDestroy...');
  }
}
