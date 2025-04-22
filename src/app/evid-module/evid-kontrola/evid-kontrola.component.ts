import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

import { PageSettingsModel,  EditSettingsModel, ToolbarItems, 
  GridComponent, Column, DataSourceChangedEventArgs, IRow, CommandModel, IEditCell, RowSelectEventArgs, RowDeselectEventArgs, CellEditArgs, BeforeBatchAddArgs, QueryCellInfoEventArgs, GridLine, SortEventArgs  } from '@syncfusion/ej2-angular-grids';
  import { closest, EmitType } from '@syncfusion/ej2-base';
  import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

  import { UserSessionService } from '../../core-services/user-session.service';
  import { LoaderService } from '../../core-services/loader.service';
import { RestDataSource } from '../../shared/rest.datasource';
import { EvidDnevnikService } from '../services/evid-dnevnik.service';

import { EvidSifra } from '../../model/evid-sifra.model';
import { EvidDnevnik } from '../../model/evid-dnevnik.model';
import { DataManager, Query } from '@syncfusion/ej2-data';

import { ButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { EvidDnStatus } from '../../model/evid-dnstatus.model';

@Component({
  selector: 'nga-evid-kontrola',
  templateUrl: './evid-kontrola.component.html',
  styleUrls: ['./evid-kontrola.component.css']
})
export class EvidKontrolaComponent implements OnInit {

  public sfrevidprisData: EvidSifra[] = new Array<EvidSifra>(); 

  public evidDnStatusData: EvidDnStatus[] = new Array<EvidDnStatus>();
  public evidDnStatusSearched: EvidDnStatus[] = new Array<EvidDnStatus>();

  public pageSettings!: PageSettingsModel;
  public editSettings!: EditSettingsModel;
  public commands!: CommandModel[];  
  public toolbar!: ToolbarItems[];

  @ViewChild('grid', { static: false }) 
  public grid!: GridComponent;

  public lines!: GridLine;
  public sortOptions!: object;

  public formatOptions!: Object;
  public customAttributes!: Object;

  public boolParams!: IEditCell;
  public timeParams!: IEditCell;

  isLoading = true;
  showLoader!: boolean;

  private rowIdAdd : number = -100;

  public gridSearch: string = "";
  public isinitialLoad: boolean = false; 

  thisUrl: string;

  selectedRowIndex!: number;
  public compTitle!: string;

  
  @ViewChild('ddlelM', { static: false })
  public dropDownListM!: DropDownListComponent;

  @ViewChild('ddlelY', { static: false })
  public dropDownListY!: DropDownListComponent;
  
  public _MM!: number;
  public _YYYY!: number;

  public ddlDataM: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];  
  public ddlDataY: number[] = [2019,2020,2021,2022,2023];  

  public ddlM!: number;
  public ddlY!: number;
  public dummyParsedDataGrid: EvidDnevnik[] = new Array<EvidDnevnik>();


  public timeList: string[] = [
    "6:00" , 
    "6:15" , 
    "6:30" , 
    "6:45" , 
    "07:00" , 
    "07:15" ,
    "07:30" ,
    "07:45" ,
    "08:00" ,
    "08:15" , 
    "08:30" , 
    "08:45" , 
    "09:00" ,
    "09:15" ,
    "09:30" ,
    "09:45" ,
    "10:00" ,
    "10:15" ,
    "10:30" ,
    "10:45" ,
    "11:00" ,
    "11:15" , 
    "11:30" , 
    "11:45" , 
    "12:00" ,
    "12:15" , 
    "12:30" , 
    "12:45" , 
    "13:00" , 
    "13:15" ,
    "13:30" , 
    "13:45" ,  
    "14:00" , 
    "14:15" , 
    "14:30" , 
    "14:45" , 
    "15:00" ,
    "15:15" , 
    "15:30" ,
    "15:45" ,
    "16:00" ,
    "16:15" , 
    "16:30" ,
    "16:45" ,
    "17:00" , 
    "17:15" , 
    "17:30" , 
    "17:45" , 
    "18:00" , 
    "18:15" , 
    "18:30" , 
    "18:45" , 
    "19:00" , 
    "19:15" , 
    "19:30" ,
    "19:45" ,
    "20:00" , 
    "20:15" , 
    "20:30" , 
    "20:45" ,
    "21:00" ,
    "21:15" , 
    "21:30" ,
    "21:45" , 
    "22:00" , 
    "22:15" , 
    "22:30" , 
    "22:45" , 
    "23:00" , 
    "23:15" ,
    "23:30" , 
    "23:45" , 
    "00:00" , 
    "00:15" , 
    "00:30" , 
    "00:45" , 
    "01:00" ,
    "01:15" , 
    "01:30" ,
    "01:45" ,
    "02:00" ,
    "02:15" ,
    "02:30" ,
    "02:45" ,
    "03:00" , 
    "03:15" , 
    "03:30" ,
    "03:45" ,
    "04:00" , 
    "04:15" , 
    "04:30" ,
    "04:45" , 
    "05:00" , 
    "05:15" , 
    "05:30" , 
    "05:45" , 
    " - "          
  ]  
  public rowsCounted: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  buttonObracun: boolean = false;
  odobrenje!: string;

  
  constructor(
    public userSessionService: UserSessionService,    
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,    
    public restDataSource: RestDataSource,
    public eDneService: EvidDnevnikService            
    
  ) { 
    this.thisUrl = this.route.snapshot.url[0].path;    


  }

    
  ngOnInit() {

    this.compTitle  = "Dnevnik rada / Evidencija odsustva";

    let _dt = this.userSessionService.firstDate;  
    //_dt.setDate(_dt.getDate() - 6);

    this._MM = this.route.snapshot.params["mm"] != undefined ? +this.route.snapshot.params["mm"] : _dt.getMonth() + 1;
    this._YYYY = this.route.snapshot.params["yyyy"]!= undefined ? +this.route.snapshot.params["yyyy"] :_dt.getFullYear();    

    this.editSettings = {
      showConfirmDialog: false, showDeleteConfirmDialog: false,
      allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch'
    };

    let _pageSize:number = this.userSessionService.gridPageSize["evid_kontrola"] != undefined? this.userSessionService.gridPageSize["evid_kontrola"] : 12;
    this.pageSettings = { pageSizes:  ['12', '20', '30', '40','50'], pageSize: _pageSize };

    
    // HACK: 'Delete', ne može jer se tabela deformiše
    this.toolbar = ['Update', 'Cancel'];
    this.commands = [{ buttonOption: { content: 'Reset', cssClass: 'e-flat', click: this.onClick.bind(this) } }];
    this.formatOptions = { type: 'date', format: 'dd.MM.yyyy' };
    this.customAttributes = { class: 'customcss' };

    this.boolParams = { params: { checked: true } };

    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

    this.evidDnStatusData = this.route.snapshot.data['eviddnstatus'];


    //HACK DateTime konverzija - bez ovoga Grid tretira kolonu kao string
    let _dummyDataGrid: string;
    _dummyDataGrid = JSON.stringify(this.evidDnStatusData);  
    this.convertToDateTime(_dummyDataGrid);

    this.sfrevidprisData = this.route.snapshot.data['evidsifra'];

    this.sortOptions = { columns: [{ field: 'empLastName', direction: 'Ascending' }] };

    this.ddlM = this._MM; //HACK: index za mjesec počinje od 0
    this.ddlY = this._YYYY;    


    //this.grid.pagerModule.goToPage(2);
    console.log("evid kontrola ngOnInit: " + JSON.stringify(this.pageSettings));
  }

 
// METHODS /////////////////////////////////////////////////////////////////////////  

  convertToDateTime(_dummyDataGrid: string) {

    this.dummyParsedDataGrid = JSON.parse(_dummyDataGrid, (field, value) => {
      let dupValue: string = value;
      if (typeof value === 'string' && /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*){1})([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(value)) {
        let arr = dupValue.split(/[^0-9]/);

        let dt = new Date();
        dt = new Date(Date.UTC(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10),
          parseInt(arr[3], 10), parseInt(arr[4], 10), parseInt(arr[5], 10)));
        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());

        return dt;
      } else {
        return value;
      };

    });

    this.grid.dataSource = this.dummyParsedDataGrid.map( res => {
      if((res.vrijeme_od===res.vrijeme_do)&&(res.vrijeme_od==="00:00")){
       res.vrijeme_od = "";
       res.vrijeme_do = "";
      }
      return res;
});;     
}



updEvidDnStatus(_evidDnStatusData: EvidDnStatus[]){
  this.loaderService.display(true);

  this.restDataSource.updEvidDnStatus(_evidDnStatusData)
    .subscribe((result) => {
      this.refreshGrid();

      //this.grid.refresh();
      //this.loaderService.display(false);
    },
      err => {
        console.log(err);
        this.loaderService.display(false);
      });
}

gotoKalendar(_empId: number, _mm: number, _yyyy: number) {

  this.loaderService.display(true);

  this.router.navigateByUrl(`/evid_calendar/${_empId}/${_mm}/${_yyyy}`);

}  

gotoEvidencija(_empId: number, _mm: number, _yyyy: number) {

  this.loaderService.display(true);
  this.router.navigateByUrl(`/evid_dnevnik2/${_empId}/${_mm}/${_yyyy}`);

}

show() {
  this.grid.columnChooserModule.openColumnChooser(200, 50); // give X and Y axis
}

onKontrola(){
  
  let _evidDnStatusData: EvidDnStatus[] = new Array<EvidDnStatus>();

  for (let _oneRec of this.evidDnStatusSearched) {
    if ((_oneRec.locked_ext === false) && (_oneRec.evd_kontrolisao == 0)) {
      _oneRec.evd_kontrolisao = this.userSessionService.empId;
      _evidDnStatusData.push(_oneRec);
    }
  }

  if(_evidDnStatusData.length>0){
    this.updEvidDnStatus(_evidDnStatusData);
  }
  //this.refreshGrid();
}

offKontrola(){

  let _evidDnStatusData: EvidDnStatus[] = new Array<EvidDnStatus>();

  for (let _oneRec of this.evidDnStatusSearched) {
    if ((_oneRec.locked_ext === false) && ((_oneRec.evd_kontrolisao ?? 0) > 0)) {
      _oneRec.evd_kontrolisao = 0;
      _evidDnStatusData.push(_oneRec);
    }
  }


  if(_evidDnStatusData.length>0){
    this.updEvidDnStatus(_evidDnStatusData);
  }
  //this.refreshGrid();  
}

onLock(){

  let _evidDnStatusData: EvidDnStatus[] = new Array<EvidDnStatus>();

  for (let _oneRec of this.evidDnStatusSearched) {
    if (((_oneRec.evd_podnio ?? 0) > 0) && ((_oneRec.evd_kontrolisao ?? 0) > 0)&& (_oneRec.evd_stopped === 0)&& (_oneRec.locked_ext === false)) {
      _oneRec.locked_ext = true;
      _evidDnStatusData.push(_oneRec);
    }
  }

  if(_evidDnStatusData.length>0){
    this.updEvidDnStatus(_evidDnStatusData);
  }

  //this.refreshGrid(); 
  
}

offLock(){

  let _evidDnStatusData: EvidDnStatus[] = new Array<EvidDnStatus>();

  for (let _oneRec of this.evidDnStatusSearched) {
    if (_oneRec.locked_ext === true) {
      _oneRec.locked_ext = false;
      _evidDnStatusData.push(_oneRec);
    }
  }

  if(_evidDnStatusData.length>0){
    this.updEvidDnStatus(_evidDnStatusData);
  }
  //this.refreshGrid(); 
  
}


gotoPDF() {

  this.loaderService.display(true);

  this.restDataSource.getPdfReportEvidDnevnik(this.userSessionService.empId,  this.ddlM, this.ddlY).subscribe(
    (pdffilename: string) => {
      this.loaderService.display(false);
      this.router.navigateByUrl('/pdfviewer/' + pdffilename);
    },
    err => {
      console.log(err);
      this.loaderService.display(false);
    }
  );

}


searchGrid() {
  this.userSessionService.gridSearch["evid_kontrola"] = (document.getElementsByClassName('searchtext')[0] as any).value;
  this.gridSearch = this.userSessionService.gridSearch["evid_kontrola"];

  this.grid.search(this.gridSearch);
   
}

public refreshGrid() {

  this.loaderService.display(true);
  this.isinitialLoad = true; 
  console.log("refreshGrid-isInitialLoad: " +  this.isinitialLoad);  

  this.restDataSource.getEvidDnStatus( this.ddlM, this.ddlY)
  .subscribe((result) => {
    this.evidDnStatusData = result;

    let _dummyDataGrid: string;
    _dummyDataGrid = JSON.stringify(this.evidDnStatusData);
    this.convertToDateTime(_dummyDataGrid);

    this.loaderService.display(false);
  },
    err => {
      console.log(err);
      this.loaderService.display(false);
    });

   
}

// EVENTS /////////////////////////////////////////////////////////////////////////

load(args: any) { 
  this.isinitialLoad = true; 
  console.log("load: " +  this.isinitialLoad);   
} 

dataBound(args: any){

  this.loaderService.display(false);

  if(this.isinitialLoad){

    if(this.userSessionService.gridSearch["evid_kontrola"] != undefined){

      this.gridSearch = this.userSessionService.gridSearch["evid_kontrola"];  

      if (this.gridSearch.length > 0) {

        console.log("dataBound search: " + this.gridSearch);        
        this.grid.search(this.gridSearch);
      } else {

        let _currentPage: number = this.userSessionService.gridCurrentPage["evid_kontrola"] != undefined ? this.userSessionService.gridCurrentPage["evid_kontrola"] : 1;
        console.log("dataBound page-1: " + _currentPage);
        this.grid.goToPage(_currentPage);
      }

  }else {

    let _currentPage: number = this.userSessionService.gridCurrentPage["evid_kontrola"] != undefined ? this.userSessionService.gridCurrentPage["evid_kontrola"] : 1;
    console.log("dataBound page-2: " + _currentPage);
    this.grid.goToPage(_currentPage);
  }

}

}

beforeBatchAdd(args: BeforeBatchAddArgs) {

  //console.log("beforeBatchAdd 1: " + JSON.stringify(args));

  if ((this.grid.getSelectedRowIndexes().length > 0)) {

    let _dataRow = this.grid.getSelectedRecords()[0] as {
      locked: boolean;
      sifra_placanja: string;
      employeeID: number;
      datum: string;
      week_day: number;
      vrijeme_do?: string;
      opis_rada?: string
    };;  //HACK: getSelectedRows ovdje ništa ne vraća
    if (_dataRow.locked === true) {
      args.cancel = true;         
    }
    if ((_dataRow['sifra_placanja'] === "RRD")) {

      this.rowIdAdd = this.rowIdAdd - 1;

      if (args.defaultData && typeof args.defaultData === 'object') {
        (args.defaultData as { [key: string]: any })['id'] = this.rowIdAdd;
      }
      (args.defaultData  as { [key: string]: any })['employeeID'] = _dataRow['employeeID'];
      (args.defaultData  as { [key: string]: any })['sifra_placanja'] = _dataRow['sifra_placanja'];
      (args.defaultData  as { [key: string]: any })['datum'] = _dataRow['datum'];
      (args.defaultData  as { [key: string]: any })['week_day'] = _dataRow['week_day'];        
      (args.defaultData  as { [key: string]: any })['vrijeme_od'] = _dataRow['vrijeme_do'];
      (args.defaultData  as { [key: string]: any })['vrijeme_do'] = _dataRow['vrijeme_do'];
      (args.defaultData  as { [key: string]: any })['opis_rada'] = _dataRow['opis_rada'];
      (args.defaultData  as { [key: string]: any })["keyday"] = false;        
      (args.defaultData  as { [key: string]: any })["locked"] = false;
    } else {
      alert("Morate označiti red iz tabele gdje je redovan rad!");
      args.cancel = true;        
    }

  } else {
    alert("Morate označiti red iz tabele gdje je redovan rad!");
    args.cancel = true;
  }
}

beforeBatchDelete(args: any) {

  //console.log("actionBegin: " + JSON.stringify(args));

  if ((args.rowData.keyday === true) || (args.rowData.locked === true)) {
    alert("Možete brisati samo red iz tabele gdje je redovan rad!");      
    args.cancel = true;
  } 

}

beforeBatchSave(args: any) {

  let _evidDnStatusData: EvidDnStatus[] = new Array<EvidDnStatus>();

  for (let _oneRec of args.batchChanges.changedRecords) {
    let _evidDnStatus: EvidDnStatus = _oneRec as EvidDnStatus;

    switch (_oneRec['evd_kontrolisao']) {
      case true:
        _evidDnStatus.evd_kontrolisao = this.userSessionService.empId;
        break;
      case false:
        _evidDnStatus.evd_kontrolisao = 0;
        break;
    }

    switch (_oneRec['evd_stopped']) {
      case true:
        _evidDnStatus.evd_stopped = this.userSessionService.empId;
        break;
      case false:
        _evidDnStatus.evd_stopped = 0;
        break;
    }

    switch (_oneRec['locked_ext']) {
      case true:
        _evidDnStatus.locked_ext = true;
        break;
      case false:
        _evidDnStatus.locked_ext = false;
        break;
    }

    _evidDnStatusData.push(_evidDnStatus);
    //console.log("beforeBatchSave: " + JSON.stringify(_oneRec));
    //console.log("beforeBatchSave: " + JSON.stringify(_evidDnStatusData));

  }


  this.loaderService.display(true);
  this.updEvidDnStatus(_evidDnStatusData);

}

cellEdit(args: CellEditArgs) {
  if ((args.columnName == "evd_kontrolisao")||(args.columnName == "evd_stopped")||(args.columnName == "locked_ext")) {
    args.cancel = true;
  }
}

public queryCellInfoEvent: EmitType<QueryCellInfoEventArgs> = (args: QueryCellInfoEventArgs) => {


};

customiseCell(args: QueryCellInfoEventArgs) {

  if (args.column?.field === 'sifra_placanja') {
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

  if (args.column?.field === 'datum' || args.column?.headerText === 'Dan' || args.column?.field === 'vrijeme_od'  || args.column?.field === 'vrijeme_do'){
    if (args.data && typeof args.data === 'object' && 'week_day' in args.data && (args.data as { week_day: number })['week_day'] === 6) {
      args.cell?.classList.add('weekday-ned');
    } else {
      //args.cell.classList.add('sfr-rrd');
    }
  }    
}  

  actionComplete(args: any) {

    console.log("actionComplete.request:" + JSON.stringify(args.requestType));    
    if (args.requestType == "paging") {
      this.userSessionService.gridCurrentPage["evid_kontrola"] = this.grid.pagerModule.pagerObj.currentPage;
      this.userSessionService.gridPageSize["evid_kontrola"] = this.grid.pagerModule.pagerObj.pageSize;

      if(this.isinitialLoad){
        let _SelectedRowIndex:number = this.userSessionService.gridSelectedRowIndex["evid_kontrola"] != undefined ? this.userSessionService.gridSelectedRowIndex ["evid_kontrola"] : -1;          
        this.isinitialLoad = false; 

        console.log("actionComplete.RowIdx: " + _SelectedRowIndex);  

        if(_SelectedRowIndex > -1){         
          this.grid.selectRow(_SelectedRowIndex);
        }
      }
    }

    if (args.requestType == "searching") {
      if (!args.searchString) {
        this.evidDnStatusSearched = [];        
        this.evidDnStatusSearched = this.evidDnStatusData; 
        //console.log("actionComplete.request 1:"  + JSON.stringify(this.evidDnStatusSearched));                   
      }
      else {
        this.evidDnStatusSearched = [];
        for (var i = 0; i < args.rows.length; i++) {
          this.evidDnStatusSearched.push(args.rows[i].data);
        }          
      }

      if(this.isinitialLoad){
        let _currentPage:number = this.userSessionService.gridCurrentPage["evid_kontrola"] != undefined ? this.userSessionService.gridCurrentPage["evid_kontrola"] : 1; 
        console.log("actionComplete.searching page: " + _currentPage);       
        this.grid.goToPage(_currentPage);
      }      
    }

    if (args.requestType == "refresh") {    
      this.isinitialLoad = false;
    }

  }  



  public dataSourceChanged(state: DataSourceChangedEventArgs): void {

    //console.log("dataSourceChanged.add:" + state.action);

    if (state.action === 'add') {

    } else if (state.action === 'edit') {

    } else if (state.requestType === 'delete') {


    }
  }

  onClick(args: Event): void {
    let rowObj: IRow<Column> = this.grid.getRowObjectFromUID(closest(<Element>args.target, '.e-row').getAttribute('data-uid') || '');
    if (rowObj.data) {
      let data: Object = rowObj.data;
      alert(JSON.stringify(data));
    } else {
      console.error("Row data is undefined.");
    }
  }

  onSelect(args: any): void {
    //this.usersession.apiDays = args.itemData.value;
    //this.refreshGrid();
    //console.log("onSelect page: " + this.pageSettings.currentPage);
  }
  

  public rowSelected(args: RowSelectEventArgs) {

    console.log("rowSelected: " + args.rowIndex);
    this.userSessionService.gridSelectedRowIndex["evid_kontrola"] = args.rowIndex ?? -1;  

  }
  
  public rowDeselected(args: RowDeselectEventArgs) {

  }


change(args: any, rowData: any){

  //console.log("change checkbox 1: " + JSON.stringify(args));
  //console.log("change checkbox 2: " + JSON.stringify(rowData));  
  let _obj = this.grid.editModule.getBatchChanges() as { changedRecords: any[] };
  //console.log("change checkbox 2: " + JSON.stringify(_obj)); 
  rowData['locked_ext'] = true; 
  _obj['changedRecords'].push(rowData);
  //_obj['changedRecords'] = rowData;
  //console.log("change checkbox 2: " + JSON.stringify(_obj));     
  //this.grid.editModule.updateCell(args.event.target.closest('tr').rowIndex, 'Discontinued', args.checked);
}

changeKontrola(args: any, rowData: any){ 
  this.grid.editModule.updateCell(args.event.target.closest('tr').rowIndex, 'evd_kontrolisao', args.checked); 
} 

changeOpoziv(args: any, rowData: any){ 
  this.grid.editModule.updateCell(args.event.target.closest('tr').rowIndex, 'evd_stopped', args.checked); 
} 

changeLockedExt(args: any, rowData: any){ 
  this.grid.editModule.updateCell(args.event.target.closest('tr').rowIndex, 'locked_ext', args.checked); 
} 


}
