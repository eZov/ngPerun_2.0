import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ToastUtility, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { DialogUtility } from '@syncfusion/ej2-angular-popups';
import { PageSettingsModel, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';

import { OrgjedService } from '../services/orgjed.service';
import { LoaderService } from '../../core-services/loader.service';
import { MessageService } from '../../messages/message.service';

import { EmployeesService } from '../services/employees.service';
import { EmployeeService } from '../services/employee.service';
import { EmployeeRec } from '../../model/employeerec.model';
import { OrgListService } from '../../services/org-list.service';


// import { Model } from "../model/repository.model"

@Component({
  selector: 'adm-employees-data',
  templateUrl: './employees-data.component.html',
  styleUrls: ['./employees-data.component.css'],
})
export class EmployeesDataComponent {
  private subs: Subscription[] = [];

  @Output() callParentMethod: EventEmitter<void> = new EventEmitter();

  public toastObj?: ToastComponent;



  checkboxLabel: string = '';

  public ddlData!: Object[];
  // maps the appropriate column to fields property
  public fields: Object = { value: 'broj', text: 'opis' };


  // @ViewChild('ejDateTimePicker1', { static: false })
  // public dateObj?: any;  

  public DialogObj: any;
  public data?: object[];
  public dataEmployees?: EmployeeRec[];
  public pageSettings?: PageSettingsModel;

  constructor(
    private employeesService: EmployeesService,
    private employeeService: EmployeeService,
    public messageService: MessageService
  ) {

  }

  ngOnInit() {

    this.pageSettings = { pageSize: 12 };

    const sub1 = this.employeesService.data.subscribe(result => {

      console.log('employees-data - ngOnInit - dataService.data.subscribe - result: ', result);
      this.dataEmployees = result;
      this.data = result.map((item: any) => {
        return { EmployeeID: item.EmployeeID, Name: (item.FirstName + " " + item.LastName) };
      }
      );

      this.employeeService.setEmployee(
        new EmployeeRec()
      );
    });
    this.subs.push(sub1);


  }

  rowSelected(args: RowSelectEventArgs): void {
    console.log('employees-data - rowSelected - args: ', JSON.stringify(args.data));
    this.employeeService.setEmployee(
      this.dataEmployees!.filter((item: EmployeeRec) => item.EmployeeID === (<{ EmployeeID: number, Name: string}>args.data!).EmployeeID)[0]
    );

  }


  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    console.log('client-data -ngOnDestroy...');
  }
}
