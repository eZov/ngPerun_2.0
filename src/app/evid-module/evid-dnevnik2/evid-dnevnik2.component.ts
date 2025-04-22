import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

import { Subject, timer, of, EMPTY, Subscription } from "rxjs";
import { switchMap, concatMap } from "rxjs/operators";

import {
  PageSettingsModel, EditSettingsModel, ToolbarItems, GridComponent, Column, IRow, CommandModel,
  IEditCell, CellEditArgs, BeforeBatchAddArgs, QueryCellInfoEventArgs, GridLine, CellSaveArgs, ForeignKeyService,
  CellDeselectEventArgs, RowDeselectEventArgs, SelectionSettingsModel
} from "@syncfusion/ej2-angular-grids";
import { closest, EmitType, MouseEventArgs } from "@syncfusion/ej2-base";
import { Query } from "@syncfusion/ej2-data";
import { ButtonComponent } from "@syncfusion/ej2-angular-buttons";
import { CalendarView, ChangedEventArgs, DatePickerComponent } from "@syncfusion/ej2-angular-calendars";
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { ToastUtility, Toast } from '@syncfusion/ej2-angular-notifications';

import { UserSessionService } from '../../core-services/user-session.service';
import { LoaderService } from '../../core-services/loader.service';
import { RestDataSource } from "../../shared/rest.datasource";

import { TimeListService } from "../services/time-list.service";
import { EvidDnevnikService } from '../services/evid-dnevnik.service';

import { EvidSifra } from "../../model/evid-sifra.model";
import { EvidDnevnik } from "../../model/evid-dnevnik.model";
import { EvidTime } from "../../model/evid-time.model";
import { EvidGodOdm } from "../../model/evid-gododm.model";
import { EmployeeRec } from "../../model/employeerec.model";


@Component({
  selector: "nga-evid-dnevnik2",
  templateUrl: "./evid-dnevnik2.component.html",
  styleUrls: ["./evid-dnevnik2.component.css"],
  providers: [ForeignKeyService],
  // providers: [ CommandColumnService]
})
export class EvidDnevnik2Component implements OnInit, AfterViewInit {
  private subs: Subscription[] = [];

  public sfrevidprisData: EvidSifra[] = new Array<EvidSifra>();

  @ViewChild("grid", { static: false })
  public grid!: GridComponent;

  public pageSettings!: PageSettingsModel;
  public editSettings!: EditSettingsModel;
  public commands!: CommandModel[];
  public toolbar!: ToolbarItems[] | object;

  public lines!: GridLine;
  public sortOptions!: object;

  public formatOptions!: Object;
  public customAttributes!: Object;

  public boolParams!: IEditCell;
  public timeParams!: IEditCell;

  public flagAutoSave = false;

  //DropDoenList u grid - šifre
  public sfrfields: Object = { text: "title", value: "sifra" };

  isLoading = true;
  showLoader!: boolean;

  private rowIdAdd: number = -100;

  thisUrl: string;

  selectedRowIndex!: number;
  public compTitle!: string;
  public compName!: string;

  // DatePicker
  @ViewChild("datePicker", { static: false })
  public dp!: DatePickerComponent;

  public start: CalendarView = "Year";
  public depth: CalendarView = "Year";
  public format: string = "MM.yyyy";
  // ////////////////////////////////////////////////////////////

  public ddlM!: number;
  public ddlY!: number;

  public timeListOld: EvidTime[] = [
    { keyTime: "6:00", valTime: "06:00" },
    { keyTime: "6:15", valTime: "06:15" },
    { keyTime: "6:30", valTime: "06:30" },
    { keyTime: "6:45", valTime: "06:45" },
    { keyTime: "07:00", valTime: "07:00" },
    { keyTime: "07:15", valTime: "07:15" },
    { keyTime: "07:30", valTime: "07:30" },
    { keyTime: "07:45", valTime: "07:45" },
    { keyTime: "08:00", valTime: "08:00" },
    { keyTime: "08:15", valTime: "08:15" },
    { keyTime: "08:30", valTime: "08:30" },
    { keyTime: "08:45", valTime: "08:45" },
    { keyTime: "09:00", valTime: "09:00" },
    { keyTime: "09:15", valTime: "09:15" },
    { keyTime: "09:30", valTime: "09:30" },
    { keyTime: "09:45", valTime: "09:45" },
    { keyTime: "10:00", valTime: "10:00" },
    { keyTime: "10:15", valTime: "10:15" },
    { keyTime: "10:30", valTime: "10:30" },
    { keyTime: "10:45", valTime: "10:45" },
    { keyTime: "11:00", valTime: "11:00" },
    { keyTime: "11:15", valTime: "11:15" },
    { keyTime: "11:30", valTime: "11:30" },
    { keyTime: "11:45", valTime: "11:45" },
    { keyTime: "12:00", valTime: "12:00" },
    { keyTime: "12:15", valTime: "12:15" },
    { keyTime: "12:30", valTime: "12:30" },
    { keyTime: "12:45", valTime: "12:45" },
    { keyTime: "13:00", valTime: "13:00" },
    { keyTime: "13:15", valTime: "13:15" },
    { keyTime: "13:30", valTime: "13:30" },
    { keyTime: "13:45", valTime: "13:45" },
    { keyTime: "14:00", valTime: "14:00" },
    { keyTime: "14:15", valTime: "14:15" },
    { keyTime: "14:30", valTime: "14:30" },
    { keyTime: "14:45", valTime: "14:45" },
    { keyTime: "15:00", valTime: "15:00" },
    { keyTime: "15:15", valTime: "15:15" },
    { keyTime: "15:30", valTime: "15:30" },
    { keyTime: "15:45", valTime: "15:45" },
    { keyTime: "16:00", valTime: "16:00" },
    { keyTime: "16:15", valTime: "16:15" },
    { keyTime: "16:30", valTime: "16:30" },
    { keyTime: "16:45", valTime: "16:45" },
    { keyTime: "17:00", valTime: "17:00" },
    { keyTime: "17:15", valTime: "17:15" },
    { keyTime: "17:30", valTime: "17:30" },
    { keyTime: "17:45", valTime: "17:45" },
    { keyTime: "18:00", valTime: "18:00" },
    { keyTime: "18:15", valTime: "18:15" },
    { keyTime: "18:30", valTime: "18:30" },
    { keyTime: "18:45", valTime: "18:45" },
    { keyTime: "19:00", valTime: "19:00" },
    { keyTime: "19:15", valTime: "19:15" },
    { keyTime: "19:30", valTime: "19:30" },
    { keyTime: "19:45", valTime: "19:45" },
    { keyTime: "20:00", valTime: "20:00" },
    { keyTime: "20:15", valTime: "20:15" },
    { keyTime: "20:30", valTime: "20:30" },
    { keyTime: "20:45", valTime: "20:45" },
    { keyTime: "21:00", valTime: "21:00" },
    { keyTime: "21:15", valTime: "21:15" },
    { keyTime: "21:30", valTime: "21:30" },
    { keyTime: "21:45", valTime: "21:45" },
    { keyTime: "22:00", valTime: "22:00" },
    { keyTime: "22:15", valTime: "22:15" },
    { keyTime: "22:30", valTime: "22:30" },
    { keyTime: "22:45", valTime: "22:45" },
    { keyTime: "23:00", valTime: "23:00" },
    { keyTime: "23:15", valTime: "23:15" },
    { keyTime: "23:30", valTime: "23:30" },
    { keyTime: "23:45", valTime: "23:45" },
    { keyTime: "00:00", valTime: "00:00" },
    { keyTime: "00:15", valTime: "00:15" },
    { keyTime: "00:30", valTime: "00:30" },
    { keyTime: "00:45", valTime: "00:45" },
    { keyTime: "01:00", valTime: "01:00" },
    { keyTime: "01:15", valTime: "01:15" },
    { keyTime: "01:30", valTime: "01:30" },
    { keyTime: "01:45", valTime: "01:45" },
    { keyTime: "02:00", valTime: "02:00" },
    { keyTime: "02:15", valTime: "02:15" },
    { keyTime: "02:30", valTime: "02:30" },
    { keyTime: "02:45", valTime: "02:45" },
    { keyTime: "03:00", valTime: "03:00" },
    { keyTime: "03:15", valTime: "03:15" },
    { keyTime: "03:30", valTime: "03:30" },
    { keyTime: "03:45", valTime: "03:45" },
    { keyTime: "04:00", valTime: "04:00" },
    { keyTime: "04:15", valTime: "04:15" },
    { keyTime: "04:30", valTime: "04:30" },
    { keyTime: "04:45", valTime: "04:45" },
    { keyTime: "05:00", valTime: "05:00" },
    { keyTime: "05:15", valTime: "05:15" },
    { keyTime: "05:30", valTime: "05:30" },
    { keyTime: "05:45", valTime: "05:45" },
    { keyTime: " - ", valTime: " - " },
  ];

  public timeList: string[] = [
    "6:00",
    "6:15",
    "6:30",
    "6:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
    "21:15",
    "21:30",
    "21:45",
    "22:00",
    "22:15",
    "22:30",
    "22:45",
    "23:00",
    "23:15",
    "23:30",
    "23:45",
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    " - ",
  ];
  public rowsCounted: number[] = [];

  buttonObracun: boolean = false;
  odobrenje!: string;
  public godOdm!: EvidGodOdm;

  //HACK ako je ovo false izbacuje grešku....
  public _butUnSendDisable: boolean = true;

  public _empid: number;
  public _MM!: number;
  public _YYYY!: number;


  manualSave$ = new Subject<any>();   //automatsko spašavanje dnevnika

  @ViewChild("butSend", { static: false })
  public butSend!: ButtonComponent;

  constructor(
    public usersession: UserSessionService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    public restDataSource: RestDataSource,
    public eDneService: EvidDnevnikService,
    private location: Location,
    private timeListService: TimeListService
  ) {

    this.thisUrl = this.route.snapshot.url[0].path;
    this._empid = this.route.snapshot.params["empid"];
    if (this._empid == null) {
      this._empid = this.usersession.empId;
    }

  }

  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

    let _emp: EmployeeRec = this.route.snapshot.data["evidemp"];
    this.compTitle = this.eDneService.getTitle(_emp.work_station ?? -1);

    if (_emp != undefined) {
      this.compTitle = `${this.compTitle}:  ${_emp.FirstName} ${_emp.LastName} (${_emp.EmployeeID?.toString()})`;
      this.compName = ``;
    } else {
      this.compName = this.usersession.user.nameid;
    }
    // GRID parameters START  /////////////////////////////////////////////////////////////////////////////
    this.timeList = this.timeListService.timeArray("0:00", "23:59", 30);

    this.editSettings = {
      showConfirmDialog: false,
      showDeleteConfirmDialog: false,
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Batch",
    };
    this.pageSettings = { pageSizes: ["5", "10", "All"], pageSize: 12 };

    // HACK: 'Delete', ne može jer se tabela deformiše
    this.toolbar = [
      "Update",
      "Cancel",
      {
        text: "Evidencije za obračun plate (PDF format)",
        tooltipText: "Podaci koji se koriste za obraćun plate (šihtarica)",
        prefixIcon: "e-custom-icons e-pdf",
        align: "Right",
        id: "pdfPlata",
      },
      {
        text: "Dnevnik (PDF format)",
        tooltipText: "Dnevnik u PDF formi",
        prefixIcon: "e-custom-icons e-pdf",
        align: "Right",
        id: "pdfDnevnik",
      },
    ];

    this.formatOptions = { type: "date", format: "dd.MM.yyyy" };
    this.customAttributes = { class: "customcss" };

    this.boolParams = { params: { checked: true } };

    this.timeParams = {
      params: {
        allowFiltering: true,
        dataSource: this.timeList,
        fields: { text: "valTime", value: "keyTime" },
        query: new Query(),
        actionComplete: () => false,
      },
    };

    this.sortOptions = {
      columns: [
        { field: "datum", direction: "Ascending" },
        { field: "vrijeme_od", direction: "Ascending" },
      ],
    };

    this.lines = "Both";
    // GRID parameters END  ///////////////////////////////////////////////////////////////////////////////



    let _dt = this.usersession.firstDate;
    this._MM = this.route.snapshot.params["mm"] != undefined? +this.route.snapshot.params["mm"] : _dt.getMonth() + 1; //HACK: index za mjesec počinje od 0
    this._YYYY = this.route.snapshot.params["yyyy"] != undefined? +this.route.snapshot.params["yyyy"] : _dt.getFullYear();
    console.log(`Dnevnik construct-0: ${this._MM} - ${_dt.getMonth() }`);

    this.ddlM = this._MM; 
    this.ddlY = this._YYYY;



    /* SUBSCRIPTIONS START */
    const sub1 = this.eDneService.getGodOdm().subscribe((godOdmObs) => {
      this.godOdm = godOdmObs;
      console.log("Dnevnik construct-1: " + JSON.stringify(this.godOdm));
    });
    this.subs.push(sub1);

    const sub2 = this.eDneService.getBtnPodnesi().subscribe((btnPodnesi) => {
      if (this.butSend != undefined) {
        this.butSend.cssClass = btnPodnesi.cssClass;
        this.butSend.iconCss = btnPodnesi.iconCss;
        this.butSend.content = btnPodnesi.content;
        this.butSend.disabled = !btnPodnesi.enabled;
      }
      console.log("Dnevnik construct-2: " + JSON.stringify(btnPodnesi));
    });
    this.subs.push(sub2);

    const sub3 = this.eDneService.getEvidPrisSifra().subscribe((evidPrisSifra) => {
      this.sfrevidprisData = evidPrisSifra;
    });
    this.subs.push(sub3);

    const sub4 = this.eDneService.evidDnevnikDataObs.subscribe((result) => {
      this.grid.dataSource = result
    });
    this.subs.push(sub4);
    /* SUBSCRIPTIONS END */


    this.eDneService.setEvidPrisSifra(this.route.snapshot.data["evidsifra"]);
    this.sfrevidprisData = this.eDneService._evidPrisSifra;


    this.eDneService.evidDnevnikData = this.route.snapshot.data["eviddnevnik"];
    this.eDneService.setGodOdm(this.route.snapshot.data["evidgododm"]);
    this.eDneService.sendDisableSet();

    this.loaderService.display(false);
  }

  ngAfterViewInit() {
    this.dp.value = new Date(this._YYYY, this._MM -1 , 1); //HACK: index za mjesec počinje od 0. mjesec 0 je januar
    this.eDneService.evidDnevnikDataObs = this.route.snapshot.data["eviddnevnik"];

    this.countRowsGrid();

    this.ngOnInitTimer(); // automatsko spašavanje dnevnika
  }

  /* AUTOMATSKO SPAŠAVANJE DNEVNIKA -  START ///////////////////////////////////////////////////////////////////////// */
  // Automatsko spašavanje dnevnika
  ngOnInitTimer() {
    this.manualSave$
      .pipe(
        // Setovanje AUTO-SAVE
        switchMap(() => timer(0, 180 * 1000)),
        concatMap(() => this.makeRequest())
      )
      .subscribe(
        (result) => {
          console.log(result);
          // isto kao grid refresh
          if (this.flagAutoSave === true) {

            this.eDneService.evidDnevnikDataObs = result;

            this.eDneService.sendDisableSet();

            this.eDneService.getGoStatus(this._empid, this.ddlY);
          } else {
            this.loaderService.display(false);
          }
        },
        (error) => console.log("error")
      );

    this.manualSave$.next({}); // to start it off
  }

  // Automatsko spašavanje dnevnika (poziva ga: ngOnInitTimer)
  makeRequest() {
    if (this.grid != undefined) {
      this.btnBatchSave();
    }
    //const url = 'https://jsonplaceholder.typicode.com/todos/1';
    //return this.http.get(url);
    if (this.flagAutoSave) this.loaderService.display(true);
    return this.flagAutoSave
      ? this.restDataSource.getEvidDnevnik(this._empid, this._MM, this._YYYY)
      : EMPTY;
  }

  btnBatchSave() {
    var obj = this.grid.editModule;

    if (obj != undefined) {
      var batchData = obj.getBatchChanges() as { addedRecords: any[]; deletedRecords: any[]; changedRecords: any[] };
      if (
        batchData.addedRecords.length > 0 ||
        batchData.deletedRecords.length > 0 ||
        batchData.changedRecords.length > 0
      ) {
        this.flagAutoSave = true;
        obj.batchSave();
      } else {
        this.flagAutoSave = false;
        this.loaderService.display(false);
      }

      console.log(
        "oncelledit" + JSON.stringify(batchData["changedRecords"].length)
      );
    }
  }
  /* AUTOMATSKO SPAŠAVANJE DNEVNIKA -  END ///////////////////////////////////////////////////////////////////////// */


  // METHODS /////////////////////////////////////////////////////////////////////////

  evidDnevnikClick() {
    switch (this.butSend.content === "Podnesi") {
      case true: {
        this.evidDnevnikSend();
        break;
      }

      case false: {
        this.evidDnevnikUnlock();
        break;
      }
    }
  }

  public countRowsGrid() {
    let _rowsData = this.grid.dataSource as EvidDnevnik[];

    for (var el of _rowsData) {
      let d = new Date(el.datum ?? 0);
      this.rowsCounted[d.getDate()] = 0;
    }

    for (var el of _rowsData) {
      let d = new Date(el.datum ?? 0);
      this.rowsCounted[d.getDate()] += 1;
    }
  }


  gotoPDFDnevnik() {
    this.loaderService.display(true);

    this.restDataSource
      .getPdfReportEvidDnevnik(this._empid, this._MM, this._YYYY)
      .subscribe(
        (pdffilename: string) => {
          this.loaderService.display(false);
          //this.router.navigateByUrl('/pdfviewer/' + pdffilename + '/' + this.compName + '_' + 'dn_' + this._MM.toString() + '-' + this._YYYY.toString() + '.pdf');
          this.router.navigateByUrl(
            `/pdfviewer/${pdffilename}/${this._empid}/${this._MM}/${this._YYYY}`
          );
        },
        (err) => {
          console.log(err);
          this.loaderService.display(false);
        }
      );
  }

  gotoPDFPlate() {
    this.loaderService.display(true);

    this.restDataSource
      .getPdfReportEvidPlate(this._empid, this._MM, this._YYYY)
      .subscribe(
        (pdffilename: string) => {
          this.loaderService.display(false);
          this.router.navigateByUrl("/pdfviewer/" + pdffilename);
        },
        (err) => {
          console.log(err);
          this.loaderService.display(false);
        }
      );
  }

  evidDnevnikSend() {
    this.loaderService.display(true);

    this.restDataSource
      .getEvidDnevnikSend(this._empid, this._MM, this._YYYY, true)
      .subscribe(
        (result) => {
          this.eDneService.evidDnevnikDataObs = result;

          this.eDneService.sendDisableSet();

          this.eDneService.getGoStatus(this._empid, this.ddlY);
          this.loaderService.display(false);
          //TODO: refreshgrid ubačen zbog problema sa button send i unsend
          this.refreshGrid();
        },
        (err) => {
          console.log(err);
          this.loaderService.display(false);
        }
      );
  }

  evidDnevnikUnlock() {
    this.loaderService.display(true);

    this.restDataSource
      .getEvidDnevnikSend(this._empid, this._MM, this._YYYY, false)
      .subscribe(
        (result) => {
          // this.eDneService.evidDnevnikData = result;

          // this.grid.dataSource =
          //   this.eDneService.processEvidDnevnikExtData(result);
          this.eDneService.evidDnevnikDataObs = result;

          this.eDneService.sendDisableSet();

          this.eDneService.getGoStatus(this._empid, this.ddlY);

          this.loaderService.display(false);
        },
        (err) => {
          console.log(err);
          this.loaderService.display(false);
        }
      );
  }





  // EVENTS /////////////////////////////////////////////////////////////////////////
  // HACK: grid single click edit
  load(args: any) {
    // HACK: stavljen comment jer ne radi
    // this.grid.element.addEventListener("mousedown", (e: MouseEventArgs) => {
    //   if ((e.target as HTMLElement).classList.contains("e-rowcell")) {
    //     let index: number = parseInt(
    //       (e.target as HTMLElement).getAttribute("Index")
    //     );
    //     let colindex: number = parseInt(
    //       (e.target as HTMLElement).getAttribute("aria-colindex")
    //     );
    //     let field: string = this.grid.getColumns()[colindex].field;
    //     this.grid.editModule.editCell(index, field);
    //   }
    // });

    // GRID EVENTS START /////////////////////////////////////////////////////////////////////////
    //  
    this.grid.element.addEventListener(
      "keydown",
      this.keyDownHandler.bind(this)
    );
  }

  keyDownHandler(e: any) {
    if (
      (e.target as HTMLElement).classList.contains("e-input") &&
      (e.keyCode == 13 || e.keyCode == 9)
    ) {
      this.grid.editModule.saveCell();
    }

    if (
      (e.target as HTMLElement).classList.contains("e-ddl") &&
      (e.keyCode == 13 || e.keyCode == 9)
    ) {
      let temporalDivElement = document.createElement("div");
      temporalDivElement.innerHTML = (e.target as HTMLElement).outerHTML;
      let temporalInputElement =
        temporalDivElement.getElementsByTagName("input");

      this.grid.editModule.saveCell();
    }
  }

  clickToolbar(args: ClickEventArgs): void {
    if (args.item.id === "pdfDnevnik") {
      this.gotoPDFDnevnik();
    } else if (args.item.id === "pdfPlata") {
      this.gotoPDFPlate();
    }
  }

  beforeBatchAdd(args: BeforeBatchAddArgs) {
    if (this.grid.getSelectedRowIndexes().length > 0) {
      let _dataRow = this.grid.getSelectedRecords()[0] as {
        locked: boolean;
        sifra_placanja: string;
        employeeID: number;
        datum: string;
        week_day: number;
        vrijeme_do?: string;
        opis_rada?: string
      }; //HACK: getSelectedRows ovdje ništa ne vraća
      if (_dataRow.locked === true) {
        args.cancel = true;
      }
      if (
        _dataRow["sifra_placanja"] === "RRD" ||
        _dataRow["sifra_placanja"] === "RRK"
      ) {
        this.rowIdAdd = this.rowIdAdd - 1;

        if (args.defaultData && typeof args.defaultData === 'object') {
          (args.defaultData as { [key: string]: any })["id"] = this.rowIdAdd;
        }
        (args.defaultData as { [key: string]: any })["employeeID"] = _dataRow["employeeID"];
        (args.defaultData as { [key: string]: any })["sifra_placanja"] = _dataRow["sifra_placanja"];
        (args.defaultData as { [key: string]: any })["datum"] = _dataRow["datum"];
        (args.defaultData as { [key: string]: any })["week_day"] = _dataRow["week_day"];
        (args.defaultData as { [key: string]: any })["vrijeme_od"] = _dataRow["vrijeme_do"];
        (args.defaultData as { [key: string]: any })["vrijeme_do"] = _dataRow["vrijeme_do"];
        (args.defaultData as { [key: string]: any })["opis_rada"] = _dataRow["opis_rada"];
        (args.defaultData as { [key: string]: any })["keyday"] = false;
        (args.defaultData as { [key: string]: any })["locked"] = false;
      } else {
        alert(
          "Morate označiti red iz tabele gdje je redovan rad ili rad od kuće!"
        );
        args.cancel = true;
      }
    } else {
      alert(
        "Morate označiti red iz tabele gdje je redovan rad ili rad od kuće!"
      );
      args.cancel = true;
    }
  }

  beforeBatchSave(args: any) {
    this.loaderService.display(true);

    let _evidDnevnikData: EvidDnevnik[] = new Array<EvidDnevnik>(); // CHANGED RECORDS + ADDED RECORDS + DELETED RECORDS

    // Setuje vrijednosti za: SP, SND, RRD kao i
    //                                      NPL, PLC, POD
    //HACK for..of vraca vrijednosti objekta

    // CHANGED RECORDS => _evidDnevnikData
    for (let _oneRec of args.batchChanges.changedRecords) {
      let _evidDnevnik: EvidDnevnik = _oneRec as EvidDnevnik;
      if (_evidDnevnik.sifra_placanja === "SP") {
        //_evidDnevnik.opis_rada = (this.sfrevidprisData.find(e => e.sifra === _evidDnevnik.sifra_placanja)).title;
        //if (_evidDnevnik.vrijeme_od.length != 5) { _evidDnevnik.vrijeme_od = "08:00" };
        //if (_evidDnevnik.vrijeme_do.length != 5) { _evidDnevnik.vrijeme_do = "16:00" };
        _evidDnevnikData.push(_evidDnevnik);
      } else if (_evidDnevnik.sifra_placanja === "SND") {
        _evidDnevnik.opis_rada = " ";
        _evidDnevnik.vrijeme_od = " ";
        _evidDnevnik.vrijeme_do = " ";
        _evidDnevnikData.push(_evidDnevnik);
      } else if (
        _evidDnevnik.sifra_placanja != "RRD" &&
        _evidDnevnik.sifra_placanja != "RRK"
      ) {
        _evidDnevnik.opis_rada =
          "odsustvo - " +
          this.sfrevidprisData.find((e) => e.sifra === _evidDnevnik.sifra_placanja)?.title || '';
        _evidDnevnik.vrijeme_od = "08:00";
        _evidDnevnik.vrijeme_do = "16:00";

        // SUb i NED ne mogu biti BOL, GO, PL ...
        if (
          (_evidDnevnik.sifra_placanja === "NPL" ||
            _evidDnevnik.sifra_placanja === "PLC" ||
            _evidDnevnik.sifra_placanja === "POD" ||
            _evidDnevnik.sifra_placanja === "GO") &&
          (_evidDnevnik.week_day === 5 || _evidDnevnik.week_day === 6)
        ) {
          _evidDnevnik.sifra_placanja = "SND";
          _evidDnevnik.opis_rada = " ";
          _evidDnevnik.vrijeme_od = " ";
          _evidDnevnik.vrijeme_do = " ";
        }

        if ((_evidDnevnik.sifra_placanja === "GO") && ((_evidDnevnik.week_day ?? 99) < 5)) {
          if (((this.godOdm.yprev_rjes ?? 0) - (this.godOdm.yprev_isk ?? 0)) > 0) {
            _evidDnevnik.sifra_placanja = "GO-" + ((this.godOdm.ycurr ?? 9999) - 1);
            _evidDnevnik.opis_rada = _evidDnevnik.sifra_placanja;
            this.godOdm.yprev_isk = (this.godOdm.yprev_isk ?? 0) + 1;
            _evidDnevnik.vrijeme_od = "08:00";
            _evidDnevnik.vrijeme_do = "16:00";
          } else if (((this.godOdm.ycurr_rjes ?? 0) - (this.godOdm.ycurr_isk ?? 0)) > 0) {
            _evidDnevnik.sifra_placanja = "GO-" + this.godOdm.ycurr;
            _evidDnevnik.opis_rada = _evidDnevnik.sifra_placanja;
            this.godOdm.ycurr_isk = (this.godOdm.ycurr_isk ?? 0) + 1;
            _evidDnevnik.vrijeme_od = "08:00";
            _evidDnevnik.vrijeme_do = "16:00";
          } else {
            _evidDnevnik.sifra_placanja = "SND";
            _evidDnevnik.opis_rada = " ";
            _evidDnevnik.vrijeme_od = " ";
            _evidDnevnik.vrijeme_do = " ";
          }
        }

        _evidDnevnikData.push(_evidDnevnik);
      } else if (_evidDnevnik.sifra_placanja === "RRD") {
        if (
          _evidDnevnik.vrijeme_od != "00:00" &&
          _evidDnevnik.vrijeme_do === "00:00"
        ) {
          _evidDnevnik.vrijeme_do = "23:59";
        }

        _evidDnevnikData.push(_evidDnevnik);
      } else if (_evidDnevnik.sifra_placanja === "RRK") {
        console.log("RRK 1: " + JSON.stringify(_evidDnevnik));
        if (_evidDnevnik.opis_rada == undefined) {
          const foundItem = this.sfrevidprisData.find((e) => e.sifra === _evidDnevnik.sifra_placanja);
          _evidDnevnik.opis_rada = foundItem ? foundItem.title : '';
        }
        if (
          _evidDnevnik.vrijeme_od?.indexOf(":") == -1 ||
          _evidDnevnik.vrijeme_do?.indexOf(":") == -1
        ) {
          _evidDnevnik.vrijeme_od = "08:00";
          _evidDnevnik.vrijeme_do = "16:00";
        }

        if (
          _evidDnevnik.vrijeme_od != "00:00" &&
          _evidDnevnik.vrijeme_do === "00:00"
        ) {
          _evidDnevnik.vrijeme_do = "23:59";
        }

        console.log("RRK 2: " + JSON.stringify(_evidDnevnik));
        _evidDnevnikData.push(_evidDnevnik);
      } else {
        _evidDnevnikData.push(_evidDnevnik);
      }
    }

    // DELETED RECORDS => _evidDnevnikData (id je negtivan) 
    // HACK: ovo više ne treba, jer se podaci brišu u gridu
    for (let _oneRec of args.batchChanges.deletedRecords) {
      let _evidDnevnik: EvidDnevnik = _oneRec as EvidDnevnik;
      if (_evidDnevnik.id !== undefined && _evidDnevnik.id !== null) {
        _evidDnevnik.id = -_evidDnevnik.id;
      }
      _evidDnevnikData.push(_evidDnevnik);
    }

    // ADDED RECORDS => _evidDnevnikData (id = -1)
    for (let _oneRec of args.batchChanges.addedRecords) {
      let _evidDnevnik: EvidDnevnik = _oneRec as EvidDnevnik;
      _evidDnevnik.id = -1;
      _evidDnevnikData.push(_evidDnevnik);
    }

    let _evidDne = this.grid.dataSource as EvidDnevnik[]; //HACK: grid dataSource

    let _overlap = this.eDneService.checkOverlapByMonth(_evidDne, _evidDnevnikData, this.rowsCounted);

    if (_overlap == true) {
      this.toast(
        `Postoji preklapanje u terminima rada, podaci nisu upisani...`,
        "Warning"
      );
      this.loaderService.display(false);
      args.cancel = true;
      this.grid.closeEdit();
    } else {
      let _evidDnevnikData2: EvidDnevnik[] = this.eDneService.setGoOrder(_evidDnevnikData);

      this.updRow(_evidDnevnikData2);
    };

  }

  cellEdit(args: any) {

    var d = new Date(args.rowData["datum"]);
    var _date = d.getDate();
    // console.log("cellEdit: 2 ...", this.rowsCounted[_date]);

    // Nema EDIT locked polja
    if (args.rowData["locked"] === true) {
      args.cancel = true;
    }

    // Nema EDIT kolona koja nisu RRD, RRK ili SP, sem kolone sifra_placanja
    if (
      args.rowData["sifra_placanja"] != "RRD" &&
      args.rowData["sifra_placanja"] != "RRK" &&
      args.rowData["sifra_placanja"] != "SP" &&
      args.rowData["sifra_placanja"].length >= 2 &&
      args.columnName != "sifra_placanja"
    ) {
      args.cancel = true;
    }

    /* Nema EDIT kolone, ako ima više redova za isti datum...  */
    if (
      (args.rowData["sifra_placanja"] == "RRD" ||
        args.rowData["sifra_placanja"] == "RRK") &&
      args.rowData["sifra_placanja"].length >= 2 &&
      args.columnName == "sifra_placanja" &&
      this.rowsCounted[_date] > 1
    ) {
      args.cancel = true;
    }
  }

  cellSave(args: any) {
    // console.log("cellSave: 1 ..." + JSON.stringify(args.rowData));
    // console.log("cellSave: 2 ..." + JSON.stringify(args.value));

    if (args.value === "RRK") {
      this.toast(
        `Nije dozvoljen unos prisustva koja su označena sa: **`,
        "Warning"
      );
      args.value = args.previousValue;
    }

    if (args.columnName == "vrijeme_od") {
      var d = new Date(args.rowData["datum"]);
      var _date = d.getDate();
      if (this.rowsCounted[_date] > 1) {
        // ovaj datum ima više redova, provjeriti preklapanje intervala

        let _id: number = args.rowData["id"];
        let _evidDne = this.grid.dataSource as EvidDnevnik[];

        let _evidDneFiltered = _evidDne.filter(el => {
          var d1 = new Date(el["datum"] ?? 0);
          if ((d1.getDate() == _date) && (_id != el.id)) return true;
          return false;
        });

      }
    }
  }

  public queryCellInfoEvent: EmitType<QueryCellInfoEventArgs> = (
    args: QueryCellInfoEventArgs
  ) => {
    console.log("queryCellInfoEvent-entered: " + JSON.stringify(args.data));
    this.customiseCell(args);

    let data: EvidDnevnik = args.data as EvidDnevnik;
    var d = new Date(data.datum ?? 0);
    var _date = d.getDate();

    //console.log("queryCellInfoEvent-entered: " + _date);
    if (args.column?.field === "id") {
      this.countRowsGrid();
    }
    //console.log("queryCellInfoEvent-tabela: " +  this.rowsCounted[_date]);

    switch (this.rowsCounted[_date] > 1) {
      case true:
        if (args.column?.field === "datum" || args.column?.headerText === "Dan") {
          args.rowSpan = this.rowsCounted[_date];
        }
        // if (args.column.field === "sifra_placanja") {
        //   args.rowSpan = this.rowsCounted[_date];
        // }
        break;
    }

    switch (this.rowsCounted[_date] > 1) {
      case true:
        if (args.column && args.column.field === "sifra_placanja") {
          args.rowSpan = this.rowsCounted[_date];
        }
        break;
    }
  };

  customiseCell(args: any) {
    if (args.column.field === "sifra_placanja") {
      if (args.data[args.column.field] === "PLC") {
        args.cell.classList.add("sfr-plc");
      } else if (args.data[args.column.field] === "NPL") {
        args.cell.classList.add("sfr-npl");
      } else if (args.data[args.column.field] === "BOL") {
        args.cell.classList.add("sfr-bol");
      } else if (args.data[args.column.field] === "POD") {
        args.cell.classList.add("sfr-pod");
      } else if (args.data[args.column.field] === "PRV") {
        args.cell.classList.add("sfr-prv");
      } else if (args.data[args.column.field] === "SND") {
        args.cell.classList.add("sfr-snd");
      } else if (args.data[args.column.field] === "SP") {
        args.cell.classList.add("sfr-sp");
      } else if (args.data[args.column.field] === "GO") {
        args.cell.classList.add("sfr-go");
      } else if (args.data[args.column.field] === "RRD") {
        args.cell.classList.add("sfr-rrd");
      } else if (args.data[args.column.field] === "RRK") {
        args.cell.classList.add("sfr-rrk");
      } else {
        // args.cell.classList.add('sfr-rrd');
      }
    }

    if (
      args.column.field === "datum" ||
      args.column.headerText === "Dan" ||
      args.column.field === "vrijeme_od" ||
      args.column.field === "vrijeme_do"
    ) {
      if (args.data["week_day"] === 6) {
        args.cell.classList.add("weekday-ned");
      } else {
        //args.cell.classList.add('sfr-rrd');
      }
    }

    if (args.column.field === "opis_rada") {
      if (args.data["week_day"] === 6) {
        args.cell.classList.add("weekday-ned-opis");
      } else {
        //args.cell.classList.add('sfr-rrd');
      }
    }
  }

  multiAdd(e: any, idRow: any) {
    console.log("multiAdd 1: ...", idRow);

    let _evidDnevnikData2Row = this.eDneService.evidDnevnikData.find(
      (e) => e.id == idRow
    );
    if (_evidDnevnikData2Row && _evidDnevnikData2Row.datum) {
      let _datum = new Date(_evidDnevnikData2Row.datum);

      var _date = _datum.getDate();

      console.log("multiAdd 2: ...", this.rowsCounted[_date]);
      if (this.eDneService.maxNumRowsPerDay <= this.rowsCounted[_date]) return;
    } else {
      console.error("Invalid data: _evidDnevnikData2Row or datum is undefined.");
      return;
    }


    console.log("multiAdd 3: ... insert");
    _evidDnevnikData2Row.id = -1;
    _evidDnevnikData2Row.keyday = false;
    _evidDnevnikData2Row.vrijeme_od = "";
    _evidDnevnikData2Row.vrijeme_do = "";
    _evidDnevnikData2Row.opis_rada = "...";

    let _evidDnevnikData2: EvidDnevnik[] = _evidDnevnikData2Row ? [_evidDnevnikData2Row] : [];
    this.updRow(_evidDnevnikData2);

  }

  multiDelete(e: any, idRow: any) {
    let _evidDnevnikData2Row = this.eDneService.evidDnevnikData.find(
      (e) => e.id == idRow
    );
    if (_evidDnevnikData2Row) {
      if (_evidDnevnikData2Row.id !== undefined) {
        _evidDnevnikData2Row.id = -_evidDnevnikData2Row.id;
      }
    }


    let _evidDnevnikData2: EvidDnevnik[] = _evidDnevnikData2Row ? [_evidDnevnikData2Row] : [];
    this.updRow(_evidDnevnikData2);
  }

  //
  // GRID EVENTS END /////////////////////////////////////////////////////////////////////////


  updRow(_evidDnevnikData2: EvidDnevnik[]) {
    this.loaderService.display(true);

    this.eDneService.updEvidDnevnikData(_evidDnevnikData2).subscribe({
      next: (result: boolean) => {
        if (result) {
          this.eDneService.sendDisableSet();
          this.eDneService.getGoStatus(this._empid, this.ddlY);
        }
        this.loaderService.display(false);
      },
      error: (err: any) => {
        console.log(err);
        this.loaderService.display(false);
      },
    });
  }



  changeDtPick(args: ChangedEventArgs) {
    if (args.value != null) {
      let _dt: Date = new Date(args.value);
      this._YYYY = _dt.getFullYear();
      this._MM = _dt.getMonth() + 1;

      this.loaderService.display(false);
      this.refreshGrid();
    }
  }

  private toastObj!: Toast;

  toast(_message: string, _messageType: string) {
    //ToastUtility.show(_message, _messageType, 5000);
    let toastClick = () => {
      console.log("Toast click event triggered");
    };

    let toastClose = () => {
      this.toastObj.hide();
    };

    this.toastObj = ToastUtility.show({
      title: "Nedozvoljen unos",
      content: _message,
      timeOut: 5000,
      position: { X: "Right", Y: "Bottom" },
      showCloseButton: true,
      click: toastClick,
      buttons: [
        {
          model: { content: "Close" },
          click: toastClose,
        },
      ],
    });
  }


  public refreshGrid() {
    this.loaderService.display(true);

    this.eDneService.refreshEvidDnevnikData(this.usersession.user.empId, this._MM, this._YYYY, this.ddlY);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    console.log("evid-dnevnik2-ngOnDestroy... DESTROYED");
  }
}