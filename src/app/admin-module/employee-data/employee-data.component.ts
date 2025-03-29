import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ToastUtility, ToastComponent } from '@syncfusion/ej2-angular-notifications';

import { OrgjedService } from '../services/orgjed.service';
import { OrgJed } from '../../model/orgjed.model';
import { LoaderService } from '../../core-services/loader.service';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { DialogUtility } from '@syncfusion/ej2-angular-popups';
import { OrgJedListService } from '../services/orgjed-list.service';
import { EmployeesService } from '../services/employees.service';
import { EmployeeService } from '../services/employee.service';
import { EmployeeRec } from '../../model/employeerec.model';
import { OrgListService } from '../../services/org-list.service';


// import { Model } from "../model/repository.model"

@Component({
  selector: 'adm-employee-data',
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.css'],
})
export class EmployeeDataComponent {
  private subs: Subscription[] = [];

  @Output() callParentMethod: EventEmitter<void> = new EventEmitter();

  public toastObj?: ToastComponent;

  employee: EmployeeRec = new EmployeeRec();
  editing: boolean = true;
  editForm: boolean = true;

  delDisabled: boolean = true;

  employeeForm: FormGroup = new FormGroup({
    EmployeeID: new FormControl({ value: '', disabled: true }, {
      updateOn: 'change',
    }),
    EmployeeNumber: new FormControl({ value: '', disabled: false }, {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('^[0-9 ]+$'),
      ],
      updateOn: 'change',
    }),
    FirstName: new FormControl({ value: '', disabled: false }, {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-ZŠĐŽČĆa-zšđžčć0-9 ]+$'),
      ],
      updateOn: 'change',
    }),
    LastName: new FormControl({ value: '', disabled: false }, {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-ZŠĐŽČĆa-zšđžčć0-9 ]+$'),
      ],
      updateOn: 'change',
    }),
    DepartmentUP: new FormControl({ value: '', disabled: false }, {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('^[0-9 ]+$'),
      ],
      updateOn: 'change',
    }),
    emp_username: new FormControl({ value: '', disabled: false }, {
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
      ],
      updateOn: 'change',
    }),    
  });

  dropdownOptions: any[] = []; // Array to store dropdown options
  public fields: object = { text: 'Naziv', value: 'RowId' };
  public value = {id: 'id11', text: 'Item 11'};

  checkboxLabel: string = '';

  public ddlData!: Object[];



  // @ViewChild('ejDateTimePicker1', { static: false })
  // public dateObj?: any;

  public DialogObj: any;

  constructor(
    private orgListService: OrgListService,
    private employeeService: EmployeeService,
    private loaderService: LoaderService,
    public messageService: MessageService
  ) {

  }

  ngOnInit() {

    const sub1 = this.employeeService.data.subscribe(result => {

      console.log('employees-data - ngOnInit - dataService.data.subscribe - result: ', JSON.stringify(result));
      this.employee = result;
      this.employeeForm.reset(result);
      this.editing = true;
    });
    this.subs.push(sub1);

    const sub2 = this.orgListService.orgListObs.subscribe(result => {

      this.dropdownOptions = result;
      console.log('orgjed-ngOnInit' + JSON.stringify(this.dropdownOptions));
    });
    this.subs.push(sub2);

    this.orgListService.getOrgList();
  }


  submitForm(form: FormGroupDirective) {
    /*
    */
    if (form.valid) {
      this.loaderService.setLoading(true);

      Object.assign(this.employee, this.employeeForm.value);
      //this.employee.Naziv = this.employee.Naziv.replace(/\s*\([^\)]+\)/g, '').trim();

      this.employeeService.saveEmployee(this.employee).subscribe({
        next: (data) => {
          console.log('clientdata-save: ' + JSON.stringify(data));
          this.employeeService.setEmployee(this.employee);
          this.loaderService.setLoading(false);

          this.toastObj = ToastUtility.show('Uspješno su spašeni podaci', 'Success', 5000) as ToastComponent;
          //this.messageService.reportMessage(new Message(`Uspješno su spašeni podaci ${this.orgJed.Sfr} ...`, false, true));
          //this.orgjedListService.getData();
        },
        error: error => {
          this.toastObj = ToastUtility.show('Došlo je do greške tokom spašavanje organizacione jedinice', 'Error', 5000) as ToastComponent;
          console.error('Error:', error);
        }
      })
    }

  }

  resetForm() {
    this.employeeForm.reset(this.employee);
  }


  obrisi() {

    this.DialogObj = DialogUtility.confirm({
      title: 'Brisanje',
      content: "Da li ste sigurni da želite obrisati organizacionu jedinicu!",
      okButton: { text: 'Da', click: this.okClick.bind(this) },
      cancelButton: { text: 'Odustajem', click: this.cancelClick.bind(this) },
      showCloseIcon: true,
      closeOnEscape: true,
      isModal: true,
      animationSettings: { effect: 'Zoom' }
    });

    this.employeeForm.reset(this.employee);
  }

  private okClick(): void {
    this.DialogObj.hide();

    this.employeeService.delEmployee(this.employee).subscribe({
      next: (data) => {
        console.log('clientdata-osbser: ' + JSON.stringify(data));
        this.loaderService.setLoading(false);
        this.toastObj = ToastUtility.show('Uspješno je obrisana organizaciona jedinica', 'Success', 5000) as ToastComponent;
        //this.messageService.reportMessage(new Message(`Uspješno je obrisana organizaciona jedinica ${this.orgJed.Sfr} ...`, false, true));
        //this.orgjedListService.getData();
      },
      error: error => {
        this.toastObj = ToastUtility.show('Došlo je do greške tokom brisanja organizacione jedinice', 'Error', 5000) as ToastComponent;
        console.error('Error:', error);
      }
    })
  }

  private cancelClick(): void {
    this.DialogObj.hide();
  }

  dodaj() {
    this.employee = new EmployeeRec();
    this.employee.EmployeeID = -1;
    this.editing = false;
    this.delDisabled = true;

    console.log('dodaj: ' + JSON.stringify(this.employee));
    this.employeeForm.reset(this.employee);

    //this.callParentMethod.emit();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    console.log('client-data -ngOnDestroy...');
  }
}
