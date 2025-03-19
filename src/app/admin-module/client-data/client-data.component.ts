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
import { DataService } from '../services/data.service';


// import { Model } from "../model/repository.model"

@Component({
  selector: 'adm-organizacija-data',
  templateUrl: './client-data.component.html',
  styleUrls: ['./client-data.component.css'],
})
export class ClientDataComponent {
  private subs: Subscription[] = [];

  @Output() callParentMethod: EventEmitter<void> = new EventEmitter();

  public toastObj?: ToastComponent;

  orgJed: OrgJed = new OrgJed();
  editing: boolean = true;
  editForm: boolean = true;

  delDisabled: boolean = true;

  clientForm: FormGroup = new FormGroup({
    Id: new FormControl({ value: '', disabled: false }, {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('^[0-9 ]+$'),
      ],
      updateOn: 'change',
    }),
    ParentId: new FormControl({ value: '', disabled: false }, {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('^[0-9 ]+$'),
      ],
      updateOn: 'change',
    }),
    Naziv: new FormControl({ value: '', disabled: false }, {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-ZŠĐŽČĆa-zšđžčć0-9 .,()/-]+$'),
      ],
      updateOn: 'change',
    }),
    RowId: new FormControl({ value: '', disabled: false }, {
      updateOn: 'change',
    }),

  });

  updateSifra(): void {
    const parentId = this.clientForm.get('ParentId')?.value;
    this.clientForm.get('Id')?.setValue(parentId);
  }

  checkboxLabel: string = '';

  public ddlData!: Object[];
  // maps the appropriate column to fields property
  public fields: Object = { value: 'broj', text: 'opis' };


  // @ViewChild('ejDateTimePicker1', { static: false })
  // public dateObj?: any;

  public DialogObj: any;

  constructor(
    private fb: FormBuilder,
    private orgjedService: OrgjedService,
    private dataService: DataService,
    private loaderService: LoaderService,
    public messageService: MessageService
  ) {

  }

  ngOnInit() {

    const sub1 = this.orgjedService.orgJedObs.subscribe(result => {
      //console.log('orgjed-ngOnInit' + JSON.stringify(result));
      result.Naziv = result.Naziv.replace(/\s*\([^\)]+\)/g, '').trim();
      Object.assign(this.orgJed, result);

      this.editing = (this.orgJed && this.orgJed.RowId > 0) ? true : false;
      this.delDisabled = (this.orgJed && this.orgJed.RowId > 0) ? false : true;

      this.clientForm.reset(this.orgJed);
    });
    this.subs.push(sub1);
  }


  submitForm(form: FormGroupDirective) {
    /*
    */
    if (form.valid) {
      this.loaderService.setLoading(true);

      Object.assign(this.orgJed, this.clientForm.value);
      this.orgJed.Naziv = this.orgJed.Naziv.replace(/\s*\([^\)]+\)/g, '').trim();

      this.orgjedService.saveOrgJed(this.orgJed).subscribe({
        next: (data) => {
          console.log('clientdata-save: ' + JSON.stringify(data));
          this.orgjedService.setOrgjed(this.orgJed);
          this.loaderService.setLoading(false);

          this.toastObj = ToastUtility.show('Uspješno su spašeni podaci', 'Success', 5000) as ToastComponent;
          //this.messageService.reportMessage(new Message(`Uspješno su spašeni podaci ${this.orgJed.Sfr} ...`, false, true));
          this.dataService.getData();
        },
        error: error => {
          this.toastObj = ToastUtility.show('Došlo je do greške tokom spašavanje organizacione jedinice', 'Error', 5000) as ToastComponent;        
          console.error('Error:', error);
        }
      })
    }

  }

  resetForm() {
    this.clientForm.reset(this.orgJed);
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

    this.clientForm.reset(this.orgJed);
  }

  private okClick(): void {
    this.DialogObj.hide();

    this.orgjedService.delOrgJed(this.orgJed).subscribe({
      next: (data) => {
        console.log('clientdata-osbser: ' + JSON.stringify(data));
        this.loaderService.setLoading(false);
        this.toastObj = ToastUtility.show('Uspješno je obrisana organizaciona jedinica', 'Success', 5000) as ToastComponent;
        //this.messageService.reportMessage(new Message(`Uspješno je obrisana organizaciona jedinica ${this.orgJed.Sfr} ...`, false, true));
        this.dataService.getData();
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
    this.orgJed = new OrgJed();
    this.editing = false;
    this.delDisabled = true;

    console.log('dodaj: ' + JSON.stringify(this.orgJed));
    this.clientForm.reset(this.orgJed);

    //this.callParentMethod.emit();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    console.log('client-data -ngOnDestroy...');
  }
}
